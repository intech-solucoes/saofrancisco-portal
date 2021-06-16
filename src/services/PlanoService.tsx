import { BaseService, TipoRequisicao, TipoResposta } from "@intechprev/service";

import { PlanoVinculadoEntidade } from "../entidades/PlanoVinculadoEntidade";
import { PlanoEntidade } from "../entidades/PlanoEntidade";

class PlanoService extends BaseService {

  constructor() {
    super("Plano");
  }

  Buscar = () =>
    this.CriarRequisicao<Array<PlanoVinculadoEntidade>>(TipoRequisicao.GET, null, `Buscar`);

  BuscarTodos = () =>
    this.CriarRequisicao<Array<PlanoEntidade>>(TipoRequisicao.GET, null, `BuscarTodos`);

}

export default new PlanoService();