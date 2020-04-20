import { BaseService, TipoRequisicao, TipoResposta } from "@intechprev/service";

import EmpresaEntidade from "../entidades/EmpresaEntidade";

class EmpresaService extends BaseService {

    constructor() {
        super("Empresa");
    }

	BuscarTodas = () => 
		this.CriarRequisicao<Array<EmpresaEntidade>>(TipoRequisicao.GET, null, `BuscarTodas`);

}

export default new EmpresaService();