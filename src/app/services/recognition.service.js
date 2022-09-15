import { baseService } from "../services/base.service";
import { service } from "../services/service";


export const recognitionService = {
    getAwards
}

function getAwards() {
    let url = baseService.recognitionServiceEndPoint() + "/employee/awards";
    return service.fetchData(url, "GET", true);
}
