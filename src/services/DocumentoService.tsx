import { BaseService, RequestType, ResponseType } from "@intech/react-service";
import { DocumentoPastaEntidade } from "../entidades/DocumentoPastaEntidade";
import { DocumentoEntidade } from "../entidades/DocumentoEntidade";
import { ArquivoUploadEntidade } from "../entidades/ArquivoUploadEntidade";
// import { FileUploadEntidade } from "../entidades/FileUploadEntidade";

class Documento extends BaseService {
  constructor() {
    super("Documento");
  }

  // AtualizarPasta = (pasta: DocumentoPastaEntidade) =>
  // 	this.CreateRequest<string>(RequestType.POST, `AtualizarPasta`, pasta);

  // AtualizarDocumento = (doc: DocumentoEntidade) =>
  // 	this.CreateRequest<string>(RequestType.POST, `AtualizarDocumento`, doc);

  Buscar = (oidPasta?: number) =>
    this.CreateRequest<any>(RequestType.GET, `porPasta/${oidPasta}`);

  BuscarPorPlanoPasta = (cdPlano: string, oidPasta: number, criteria: string) =>
    this.CreateRequest<any>(RequestType.GET, `BuscarPorPlanoPasta/${cdPlano}/${oidPasta}/${criteria}`);

  BuscarTodosPorPasta = (oidPasta: number, criteria: string) =>
    this.CreateRequest<any>(RequestType.GET, `BuscarTodosPorPasta/${oidPasta}/${criteria}`);

  BuscarPorOidDocumento = (oidDocumento: number) =>
    this.CreateRequest<ArquivoUploadEntidade>(RequestType.GET, `BuscarPorOidDocumento/${oidDocumento}`);

  // Criar = (documento: DocumentoEntidade) =>
  // 	this.CreateRequest<string>(RequestType.POST, `Criar`, documento);

  // Deletar = (doc: DocumentoEntidade) =>
  // 	this.CreateRequest<string>(RequestType.POST, `Deletar`, doc);

  // CriarPasta = (pasta: DocumentoPastaEntidade) =>
  // 	this.CreateRequest<string>(RequestType.POST, `CriarPasta`, pasta);

  // DeletarPasta = (OID_DOCUMENTO_PASTA: number) =>
  // 	this.CreateRequest<string>(RequestType.POST, `DeletarPasta/${OID_DOCUMENTO_PASTA}`);

  Download = (OID_DOCUMENTO: number) =>
    this.CreateRequest<any>(RequestType.GET, `Download/${OID_DOCUMENTO}`, null, ResponseType.Blob);

  // EnviarDocumento = (OID_DOCUMENTO: number) =>
  // 	this.CreateRequest<any>(RequestType.GET, `enviarDocumento/${OID_DOCUMENTO}`);

  // UploadFile = (model: FileUploadEntidade) =>
  // 	this.CreateRequest<any>(RequestType.POST, `UploadFile`, model);

}

export const DocumentoService = new Documento();
