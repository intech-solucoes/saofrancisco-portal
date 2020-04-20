import DadosPessoaisEntidade from "./DadosPessoaisEntidade";
import FuncionarioEntidade from "./FuncionarioEntidade";
import EntidadeEntidade from "./EntidadeEntidade";
import EmpresaEntidade from "./EmpresaEntidade";
import UsuarioEntidade from "./UsuarioEntidade";

export default class FuncionarioDados {
    public DadosPessoais: DadosPessoaisEntidade;
    public Funcionario: FuncionarioEntidade;
    public Entidade: EntidadeEntidade;
    public Empresa: EmpresaEntidade;
    public Usuario: UsuarioEntidade;
    public NOME_EMPRESA: string;
    public CPF: string;
    public SEXO: string;
    public IDADE: string;
    public CEP: string;
    public DS_ESTADO_CIVIL: string;
    public CNPJ_EMPRESA: string;
}