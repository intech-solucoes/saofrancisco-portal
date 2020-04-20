import { BaseService, TipoRequisicao, TipoResposta } from "@intechprev/service";

import FuncionarioDados from "../entidades/FuncionarioDados";

class FuncionarioService extends BaseService {

    constructor() {
        super("Funcionario");
    }

	Buscar = () => 
		this.CriarRequisicao<FuncionarioDados>(TipoRequisicao.GET, null, `/`);

}

export default new FuncionarioService();