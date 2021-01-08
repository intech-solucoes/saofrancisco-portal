import React from 'react';
import { History } from 'history';
import { Row, Col, Box, Botao, CampoTexto, Form, Alerta, TipoBotao, TipoAlerta, CampoEstatico, TipoCampoEstatico, PosicaoTituloCampoEstatico, CampoValor } from '@intechprev/componentes-web';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import moment from "moment";

import { Page } from "../";
import { FichaFechamentoService, PlanoService, FichaFinanceiraService, FuncionarioService } from '@intechprev/prevsystem-service';
import { timingSafeEqual } from 'crypto';
import { NumFuncionalidade } from '../Page';

function formatValue(val: string) {
  return parseFloat(
    val.replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

const SliderWithTooltip = createSliderWithTooltip(Slider);

interface Props {
  history?: History;
}

interface State {
  saldoAcumulado: number;
  salarioContribuicao: number;
  dataUltimoSalario: string;
  percentualContrib: number;
  contribMensal: number;
  contribPatronal: number;
  idadeMinima: number;
  idadeMaxima: number;
  idadeAposentadoria: number;
  idadeAtual: number;
  percentualAVista: number;
  aporte: number;
  outroValor: number;
  termoAceito: boolean;
  Erro: string;
}

export default class SimuladorBeneficios extends React.Component<Props, State> {

  private page = React.createRef<Page>();
  private form = React.createRef<Form>();
  private alert = React.createRef<Alerta>();

  state: State = {
    saldoAcumulado: 0,
    salarioContribuicao: 0,
    dataUltimoSalario: "00/0000",
    percentualContrib: 0,
    contribMensal: 0,
    contribPatronal: 0,
    idadeMinima: 58,
    idadeMaxima: 80,
    idadeAposentadoria: 0,
    idadeAtual: 0,
    percentualAVista: 0,
    aporte: 0,
    outroValor: 0,
    termoAceito: false,
    Erro: ""
  }

  componentDidMount = async () => {
    var planos = await PlanoService.Buscar();
    var dados = await FuncionarioService.Buscar();

    var plano = planos.filter((plano: any) => plano.CD_PLANO !== "0001");

    if (plano.length === 0) {
      this.setState({
        Erro: "Simulador não disponível para esse plano."
      });
      await this.page.current.loading(false);
      return;
    }
    plano = plano[0];

    var cdPlano = plano.CD_PLANO;
    var saldos = await FichaFechamentoService.BuscarSaldoPorPlano(cdPlano);
    var ultimaContribuicao = await FichaFinanceiraService.BuscarUltimaExibicaoPorPlano(cdPlano);

    var dataInscricao = moment(plano.DT_INSC_PLANO, "DD/MM/YYYY");
    var dataNascimento = moment(dados.DadosPessoais.DT_NASCIMENTO, "DD/MM/YYYY");

    var idadePlano = moment().diff(dataInscricao, "years");
    var idadeAtual = moment().diff(dataNascimento, "years");

    var idadeMinima = this.state.idadeMinima;
    var idadeMaxima = this.state.idadeMaxima;

    if (idadeAtual > this.state.idadeMinima && idadePlano > 5)
      idadeMinima = idadeAtual;

    if (idadeAtual >= 80)
      idadeMaxima = 90;

    await this.setState({
      saldoAcumulado: saldos.VL_ACUMULADO,
      salarioContribuicao: ultimaContribuicao.SRC,
      dataUltimoSalario: ultimaContribuicao.DataReferencia.substring(3),
      percentualContrib: ultimaContribuicao.Percentual,
      idadeMinima,
      idadeMaxima,
      idadeAposentadoria: idadeMinima,
      idadeAtual
    });

    await this.calcularPercentual(ultimaContribuicao.Percentual);
    await this.page.current.loading(false);
  }

  calcularPercentual = async (percentual: number) => {
    var percentualPatronal = percentual > 8 ? 8 : percentual;

    await this.setState({
      percentualContrib: percentual,
      contribMensal: this.state.salarioContribuicao / 100 * percentual,
      contribPatronal: this.state.salarioContribuicao / 100 * percentualPatronal
    });
  }

  continuar = async () => {
    var outroValor = formatValue(this.state.outroValor.toString());
    if (outroValor > 0) {
      await this.setState({
        aporte: outroValor
      });
    }

    if (this.state.percentualContrib >= 8)
      this.props.history.push({
        pathname: `/simulador/maior8`,
        state: {
          ...this.state,
          aporte: outroValor > 0 ? outroValor : this.state.aporte
        }
      });
    else
      this.props.history.push({
        pathname: `/simulador/menor8`,
        state: {
          ...this.state,
          aporte: outroValor > 0 ? outroValor : this.state.aporte
        }
      });
  }

  setAporte = (val: number) => {
    this.setState({
      aporte: val,
      outroValor: 0
    });
  };

  setOutroValor = (e: any) => {
    var outroValor = formatValue(this.state.outroValor.toString());
    if (outroValor > 0) {
      this.setState({
        aporte: 0
      });
    }
  }

  render() {
    if (this.state.Erro !== "") {
      return (
        <Page Funcionalidade={NumFuncionalidade.SIMULADOR_DE_BENEFÍCIOS_CODEPREV} {...this.props} ref={this.page}>

          <Alerta tipo={TipoAlerta.danger} mensagem={this.state.Erro} />

        </Page>
      );
    }
    return (
      <Page Funcionalidade={NumFuncionalidade.SIMULADOR_DE_BENEFÍCIOS_CODEPREV} {...this.props} ref={this.page}>
        <Box>
          <Form ref={this.form}>
            <h2>Bem-vindo ao simulador de benefícios do plano CODEPREV!</h2>
            <h5 className={"mb-5 mt-3"}>
              O seu benefício será simulado com base no seu Saldo de Conta Aplicável acumulado
              até o momento, com o acréscimo das suas contribuições futuras até a data da sua aposentadoria.
                        </h5>

            <h4 className={"mt-5 mb-2"}>Seu Saldo Acumulado Atualizado</h4>
            <h5 className={"text-secondary"}><CampoEstatico valor={this.state.saldoAcumulado} tipo={TipoCampoEstatico.dinheiro} /></h5>

            <h4 className={"mt-5 mb-2"}>Seu Último Salário de Contribuição (em {this.state.dataUltimoSalario})</h4>
            <h5 className={"text-secondary"}><CampoEstatico valor={this.state.salarioContribuicao} tipo={TipoCampoEstatico.dinheiro} /></h5>
            <br />

            <h4 className={"mt-5 mb-2"}>Entre com o percentual de contribuição mensal desejado</h4>
            <div className={"mb-5 pl-4 pr-4"}>
              <SliderWithTooltip tipFormatter={(v: number) => `${v} %`}
                tipProps={{ placement: 'bottom', visible: true }}
                min={2} max={30} value={this.state.percentualContrib} dots={true}
                onChange={this.calcularPercentual} />
            </div>

            <CampoEstatico titulo={`Contribuição Mensal`} valor={this.state.contribMensal} tamanhoTitulo={"4"}
              tipo={TipoCampoEstatico.dinheiro} />

            <CampoEstatico titulo={`Contribuição Patronal (paritária até 8%)`} valor={this.state.contribPatronal} tamanhoTitulo={"4"}
              tipo={TipoCampoEstatico.dinheiro} />
            <br />

            <h4 className={"mt-5 mb-2"}>Com quantos anos você deseja se aposentar?</h4>
            <div className={"mb-5 pl-4 pr-4"}>
              <SliderWithTooltip tipFormatter={(v: number) => `${v} anos`}
                tipProps={{ placement: 'bottom', visible: true }}
                min={this.state.idadeMinima} max={this.state.idadeMaxima} value={this.state.idadeAposentadoria} dots={true}
                onChange={(val) => this.setState({ idadeAposentadoria: val })} />
            </div>
            <br />

            <h4 className={"mt-5 mb-2"}>Qual percentual do seu Saldo você deseja receber à vista na concessão do benefício?</h4>
            <div className={"mb-5 pl-4 pr-4"}>
              <SliderWithTooltip tipFormatter={(v: number) => `${v} %`}
                tipProps={{ placement: 'bottom', visible: true }}
                min={0} max={25} value={this.state.percentualAVista} dots={true}
                onChange={(val) => this.setState({ percentualAVista: val })} />
            </div>
            <br />

            <h4 className={"mt-5 mb-2"}>Deseja fazer um aporte de Contribuição Extraordinária?</h4>
            <div className={"mb-5 pl-4 pr-4"}>
              <SliderWithTooltip tipFormatter={(v: number) => <CampoEstatico valor={v} tipo={TipoCampoEstatico.dinheiro} />}
                tipProps={{ placement: 'bottom', visible: true }}
                min={0} max={50000} step={1000} value={this.state.aporte} dots={true}
                onChange={this.setAporte} />
            </div>

            <CampoValor
              contexto={this}
              nome={"outroValor"}
              valor={this.state.outroValor}
              titulo={"Outro Valor"}
              onBlur={this.setOutroValor}
            />
            <br />

            <div className={"alert alert-warning pt-4"}>
              <p>
                <ul>
                  <li>Esta é uma simulação de benefício considerando as informações do participante posicionada na data da realização do cálculo.</li>
                  <li>Os cálculos apresentados não são definitivos e resultam de projeções de caráter apenas ilustrativo, não gerando qualquer direito ao recebimento.</li>
                  <li>O presente cálculo poderá sofrer alterações quando da concessão definitiva do benefício.</li>
                  <li>Esta simulação observou as regras do Regulamento do Plano de Benefícios ao qual o participante está vinculado, vigentes na data da realização da presente simulação.</li>
                </ul>
              </p>

              <Row>
                <Col tamanho={"1"} className={"text-right"}>
                  <input type={"checkbox"} checked={this.state.termoAceito} onChange={() => this.setState({ termoAceito: !this.state.termoAceito })} />
                </Col>
                <Col>
                  <p>
                    Li e entendi!
                                    </p>
                </Col>
              </Row>
            </div>

            <Alerta ref={this.alert} padraoFormulario tipo={TipoAlerta.danger} tamanho={"6"} />
            <br /><br />
            <Botao titulo={"Simular"} tipo={TipoBotao.primary} submit onClick={this.continuar} desativado={!this.state.termoAceito} />
          </Form>
        </Box>
      </Page>
    )
  }
}