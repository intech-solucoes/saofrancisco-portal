import React from "react";

import { PageClean } from "..";

import { UsuarioService, FuncionarioService } from "@intechprev/prevsystem-service";
import { Alerta, TipoAlerta, Form, CampoTexto, Botao, TipoBotao, Row, Col } from "@intechprev/componentes-web";

interface Props {
  history?: any;
}

interface State {
  nomeUsuario: string;
  senhaNova: string;
  confirmarSenha: string;
}

export default class TrocarSenhaPrimeiroAcesso extends React.Component<Props, State> {

  private form = React.createRef<Form>();
  private alert = React.createRef<Alerta>();

  constructor(props: Props) {
    super(props);

    this.state = {
      nomeUsuario: "",
      senhaNova: "",
      confirmarSenha: ""
    }
  }

  componentDidMount = async () => {
    var dados = await FuncionarioService.Buscar();
    var nomeUsuario = dados.DadosPessoais ? dados.DadosPessoais.NOME_ENTID : dados.Funcionario.NOME_ENTID;

    await this.setState({
      nomeUsuario
    });
  }

  trocarSenha = async () => {
    // Define os estados iniciais de alertas.
    await this.alert.current.limparErros();
    await this.form.current.validar();

    // Valida se a nova senha tem 6 ou mais caracteres.
    if (this.state.senhaNova.length < 6)
      this.alert.current.adicionarErro("A nova senha deve possuir no mínimo 6 caracteres.");

    // Valida se os campos de nova senha e confirmação são iguais.
    if (this.state.senhaNova !== this.state.confirmarSenha)
      this.alert.current.adicionarErro("As senhas não coincidem.");

    try {
      if (this.alert.current.state.mensagem.length === 0 && this.alert.current.props.mensagem.length === 0) {
        await UsuarioService.TrocarSenhaPrimeiroAcesso(this.state.senhaNova);
        await alert("Senha alterada com sucesso!");
        await this.props.history.push('/');
      }
    } catch (err) {
      if (err.response)
        this.alert.current.adicionarErro(err.response.data)
      else
        console.error(err);
    }
  }

  render() {
    return (
      <PageClean tamanho={550} {...this.props}>
        Olá, {this.state.nomeUsuario},<br />
        <br />
        Seja bem-vindo!<br />
        <br />
        Esse é o seu primeiro acesso ao Portal da Fundação São Francisco! Como você recebeu uma nova senha
        gerada automaticamente, será necessário que você crie uma nova senha, com no mínimo 6 caracteres.<br />
        <br />

        <Form ref={this.form}>
          <Row className={"form-group"}>
            <label htmlFor="senhaNova" className="col-sm-4 col-form-label"><b>Nova senha</b></label>
            <Col tamanho={"8"}>
              <CampoTexto contexto={this} nome={"senhaNova"} obrigatorio tipo={"password"} valor={this.state.senhaNova} />
            </Col>
          </Row>

          <Row className={"form-group"}>
            <label htmlFor="confirmarSenha" className="col-sm-4 col-form-label"><b>Confirme nova senha</b></label>
            <Col tamanho={"8"}>
              <CampoTexto contexto={this} nome={"confirmarSenha"} obrigatorio tipo={"password"} valor={this.state.confirmarSenha} />
            </Col>
          </Row>

          <Alerta ref={this.alert} padraoFormulario tipo={TipoAlerta.danger} />

          <Botao submit titulo={"Continuar"} tipo={TipoBotao.primary} block
            onClick={() => this.trocarSenha()} usaLoading />

        </Form>
      </PageClean>
    );
  }
}