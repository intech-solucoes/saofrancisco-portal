import { BaseService, RequestType, ResponseType } from "@intech/react-service";
import { JsonWebToken } from "../entidades/JsonWebToken";
import { LoginEntidade } from "../entidades/LoginEntidade";

class Usuario extends BaseService {
  constructor() {
    super("Usuario");
  }

  VerificarAdmin = () =>
    this.CreateRequest<any>(RequestType.GET, `admin`);

  Menu = () =>
    this.CreateRequest<string[]>(RequestType.GET, `Menu`);

  CriarAcesso = (user: LoginEntidade) =>
    this.CreateRequest<string>(RequestType.POST, `criarAcesso`, user);

  AlterarSenha = (user: LoginEntidade) =>
    this.CreateRequest<string>(RequestType.POST, `alterarSenha`, user);

  AlterarSenhaPrimeiroAcesso = (user: LoginEntidade) =>
    this.CreateRequest<string>(RequestType.POST, `alterarSenhaPrimeiroAcesso`, user);

  BuscarMatriculas = () =>
    this.CreateRequest<string[]>(RequestType.GET, `matriculas`);

  Selecionar = (login: LoginEntidade) =>
    this.CreateRequest<JsonWebToken>(RequestType.POST, `selecionar`, login);

  SelecionarMatricula = (matricula: string) =>
    this.CreateRequest<JsonWebToken>(RequestType.POST, `selecionarMatricula/${matricula}`);

  Login = (user: LoginEntidade) =>
    this.CreateRequest<any>(RequestType.POST, `login`, user);

}

export default new Usuario();
