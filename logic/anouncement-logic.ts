import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { AnouncementRepository } from "../repository/anouncement-repository.ts";
import { Anouncement } from "../domain-model/anouncement.ts";

@Injectable()
export class AnouncementLogic {
    constructor(private anouncementRepository: AnouncementRepository) { }

    async get(id?: string) {
        if (id) {
            return await this.anouncementRepository.getSingle(id);
        } else {
            return await this.anouncementRepository.getAllIds();
        }
    }

    async add(anouncement: Anouncement) {
        return await this.anouncementRepository.addSingle(anouncement);
    }

    async modify(id: string, changeDefinition: any) {
        if (id) {
            return await this.anouncementRepository.modify(id, changeDefinition) || "";
        }
        return "";
    }

    async delete(id: string) {
        if (id) {
            return (await this.anouncementRepository.delete(id))?.toString() || "";
        }
        return "";
    }
}