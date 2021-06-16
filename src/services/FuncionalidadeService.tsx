import { BaseService, TipoRequisicao, TipoResposta } from "@intechprev/service";

import { WebBloqueioFuncEntidade } from "../entidades/WebBloqueioFuncEntidade";
import { FuncionalidadeEntidade } from "../entidades/FuncionalidadeEntidade";

class FuncionalidadeService extends BaseService {

  constructor() {
    super("Funcionalidade");
  }

  Buscar = () =>
    this.CriarRequisicao<Array<WebBloqueioFuncEntidade>>(TipoRequisicao.GET, null, `Buscar`);

  BuscarPorIndAtivo = (IND_ATIVO: string) =>
    this.CriarRequisicao<Array<FuncionalidadeEntidade>>(TipoRequisicao.GET, null, `BuscarPorIndAtivo/${IND_ATIVO}`);

  Bloquear = (func: WebBloqueioFuncEntidade) =>
    this.CriarRequisicao<string>(TipoRequisicao.POST, null, `Bloquear`, func);

  Desbloquear = (func: WebBloqueioFuncEntidade) =>
    this.CriarRequisicao<any>(TipoRequisicao.POST, null, `Desbloquear`, func);

  BuscarBloqueiosPorNumFuncionalidade = (NUM_FUNCIONALIDADE: number, CD_PLANO: string, CD_PLANO2: string, CD_PLANO3: string) =>
    this.CriarRequisicao<string>(TipoRequisicao.GET, null, `BuscarBloqueiosPorNumFuncionalidade/${NUM_FUNCIONALIDADE}/${CD_PLANO}/${CD_PLANO2}/${CD_PLANO3}`);

}

export default new FuncionalidadeService();