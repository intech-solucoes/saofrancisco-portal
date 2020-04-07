import PageAdmin from "../PageAdmin";
import React from "react";
import { FuncionalidadeService, PlanoService, EmpresaService, FuncionarioService } from "../../../services";
// import { FuncionalidadeService, PlanoService, EmpresaService, FuncionarioService } from "@intechprev/prevsystem-service";
import { FuncionalidadeEntidade, PlanoEntidade, EmpresaEntidade, WebBloqueioFuncEntidade } from "../../../entidades";
import { Row, Col, Box, Alerta, TipoAlerta, Combo, CampoTexto, Form, Botao, TipoBotao } from "@intechprev/componentes-web";

interface Props {}

interface State {
    bloqueios: Array<WebBloqueioFuncEntidade>;
    funcionaidades: Array<FuncionalidadeEntidade>;
    funcionalidadeSelecionada: string;
    empresas: Array<EmpresaEntidade>;
    empresaSelecionada: string;
    planos: Array<PlanoEntidade>
    planoSelecionado: string;
    matricula: string;
    motivoBloqueio: string;
}

export class BloquearFuncionalidade extends React.Component<Props, State> {
    private alerta = React.createRef<Alerta>();
    private form = React.createRef<Form>();
    private page = React.createRef<PageAdmin>();

    constructor(props: Props) {
        super(props);

        this.state = {
            bloqueios: [],
            funcionaidades: [],
            funcionalidadeSelecionada: "",
            empresas: [],
            empresaSelecionada: null,
            planos: [],
            planoSelecionado: null,
            matricula: "",
            motivoBloqueio: "Essa funcionalidade encontra-se temporariamente fora do ar."
        }
    }

    componentDidMount = async () => {
        try {
            await this.buscarListaBloqueios();

            const empresas = await EmpresaService.BuscarTodas();
            const planos = await PlanoService.BuscarTodos();

            this.setState({
                empresas,
                planos
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    buscarListaBloqueios = async () => {
        const bloqueios = await FuncionalidadeService.Buscar();
        const funcionaidades = await FuncionalidadeService.BuscarPorIndAtivo("SIM");
            
        this.setState({
            bloqueios,
            funcionaidades
        });
    }

    bloquear = async () => {
        try {
            await this.alerta.current!.limparErros();

            await this.form.current!.validar();

            if(this.form.current!.isValido()){
                const dados = await FuncionarioService.Buscar();
                const nomeUsuario = dados.DadosPessoais.NOME_ENTID;

                let func = new WebBloqueioFuncEntidade();
                  func.OID_FUNCIONALIDADE = parseInt(this.state.funcionalidadeSelecionada, 10);
                  func.CD_FUNDACAO = "01";
                  func.CD_EMPRESA = this.state.empresaSelecionada ? this.state.empresaSelecionada : null;
                  func.CD_PLANO = this.state.planoSelecionado ? this.state.planoSelecionado : null;
                  func.NUM_MATRICULA = this.state.matricula ? this.state.matricula : null;
                  func.DTA_FIM = null
                  func.TXT_MOTIVO_BLOQUEIO = this.state.motivoBloqueio;
                  func.NOM_USUARIO = nomeUsuario;

                const msg = await FuncionalidadeService.Bloquear(func);

                alert(msg);

                await this.buscarListaBloqueios();
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    Desbloquear = async (func: WebBloqueioFuncEntidade) => {
        try {
            await FuncionalidadeService.Desbloquear(func);

            await this.buscarListaBloqueios();
        }
        catch (err) {
            console.log(err);
        }
    }

    renderListaBloqueio = () => {
        if(this.state.bloqueios.length === 0){
            return(
                <Alerta mensagem={"Nenhum bloqueio ativo registrado"} tipo={TipoAlerta.danger}/>
            );
        }

        const linhas = this.state.bloqueios.map((bloqueio: WebBloqueioFuncEntidade, index: number) => {
            return(
                <tr key={index}>
                    <td>{bloqueio.DES_FUNCIONALIDADE}</td>
                    <td>{bloqueio.SIGLA_ENTID}</td>
                    <td>{bloqueio.DS_PLANO}</td>
                    <td>{bloqueio.NUM_MATRICULA}</td>
                    <td>{bloqueio.DTA_INICIO}</td>
                    <td>
                        <Botao
                            titulo={"Desbloquear"}
                            icone={"fa-unlock"}
                            tipo={TipoBotao.success}
                            onClick={() => this.Desbloquear(bloqueio)}
                        />
                    </td>
                </tr>
            );
        }); 
        return (
            <Row>
                <Col>
                    <Box titulo={"Bloqueios Ativos"}>
                        <table className={"table table-striped"}>
                            <thead>
                                <tr>
                                    <th>{"Funcionalidade"}</th>
                                    <th>{"Empresa"}</th>
                                    <th>{"Plano"}</th>
                                    <th>{"Matrícula"}</th>
                                    <th>{"Início"}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {linhas}
                            </tbody>
                        </table>
                    </Box>
                </Col>
            </Row>
        );
    }

    renderNovoBloqueio = () => {
        return(
            <Row>
                <Col>
                    <Box titulo={"Novo Bloqueio"}>
                        <Form ref={this.form}>
                            <Combo
                                contexto={this}
                                label={"Funcionalidade"}
                                nome={"funcionalidadeSelecionada"}
                                valor={this.state.funcionalidadeSelecionada}
                                opcoes={this.state.funcionaidades}
                                nomeMembro={"DES_FUNCIONALIDADE"}
                                valorMembro={"OID_FUNCIONALIDADE"}
                                textoVazio={"Escolha uma Funcionalidade"}
                                obrigatorio
                            />

                            <Combo
                                contexto={this}
                                label={"Empresa"}
                                nome={"empresaSelecionada"}
                                valor={this.state.empresaSelecionada}
                                opcoes={this.state.empresas}
                                nomeMembro={"SIGLA_ENTID"}
                                valorMembro={"CD_EMPRESA"}
                                textoVazio={"Todas"}
                            />

                            <Combo
                                contexto={this}
                                label={"Plano"}
                                nome={"planoSelecionado"}
                                valor={this.state.planoSelecionado}
                                opcoes={this.state.planos}
                                nomeMembro={"DS_PLANO"}
                                valorMembro={"CD_PLANO"}
                                textoVazio={"Todos"}
                            />
                            
                            <CampoTexto
                                contexto={this}
                                nome={"matricula"}
                                valor={this.state.matricula}
                                titulo={"Matrícula"}
                                max={9}
                            />
                            
                            <CampoTexto
                                contexto={this}
                                nome={"motivoBloqueio"}
                                valor={this.state.motivoBloqueio}
                                titulo={"Motivo Bloqueio"}
                                obrigatorio
                                textarea
                            />
                            
                            <Alerta tipo={TipoAlerta.danger} ref={this.alerta} padraoFormulario/>

                            <Botao
                                titulo={"Bloquear"}
                                icone={"fa-lock"}
                                tipo={TipoBotao.danger}
                                onClick={this.bloquear}
                            />
                        </Form>
                    </Box>
                </Col>
            </Row>
        );
    }

    render() {
        return (
            <PageAdmin {...this.props} ref={this.page}>
                {this.renderListaBloqueio()}

                {this.renderNovoBloqueio()}
            </PageAdmin>
        );
    }
}