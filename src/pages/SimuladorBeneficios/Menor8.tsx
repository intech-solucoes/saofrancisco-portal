import React from "react";
import { History } from 'history';
import { Box, CampoEstatico, TipoCampoEstatico, Row, Col, Botao, TipoBotao } from "@intechprev/componentes-web";

import { Page } from "..";
import { SimuladorCodeprevService } from "@intechprev/prevsystem-service";

interface RendaMensal {
  Percentual: number;
  Renda: number;
  Renda8: number;
  StringTempoRecebimento: string;
}

interface Props {
  location?: any;
  history?: History;
}

interface State {
  idadeAtual: number;
  idadeAposentadoria: number;
  saldoProjetado5: number;
  saldoProjetado8: number;
  valorResgate5: number;
  valorResgate8: number;
  rendaMensal: Array<RendaMensal>;
}

export default class Menor8 extends React.Component<Props, State> {

  private page = React.createRef<Page>();

  state: State = {
    idadeAtual: 0,
    idadeAposentadoria: 0,
    saldoProjetado5: 0,
    saldoProjetado8: 0,
    valorResgate5: 0,
    valorResgate8: 0,
    rendaMensal: []
  }

  componentWillMount = async () => {
    this.load();
    //this.props.navigation.addListener('willFocus', this.load);
  }

  load = async () => {
    if (typeof this.props.location.state === "undefined") {
      this.props.history.goBack();
    }
    else {
      var dados = {
        IdadeAposentadoria: this.props.location.state.idadeAposentadoria,
        PercentualContrib: this.props.location.state.percentualContrib,
        PercentualSaque: this.props.location.state.percentualAVista,
        Aporte: this.props.location.state.aporte,
        SaldoAcumulado: this.props.location.state.saldoAcumulado,
        SalarioContribuicao: formatValue(this.props.location.state.salarioContribuicao.toString())
      };

      var dadosSimulacao = await SimuladorCodeprevService.Simular(dados);

      await this.setState({
        idadeAtual: this.props.location.state.idadeAtual,
        idadeAposentadoria: this.props.location.state.idadeAposentadoria,
        saldoProjetado5: dadosSimulacao.SaldoProjetado,
        saldoProjetado8: dadosSimulacao.SaldoProjetado8,
        valorResgate5: dadosSimulacao.Saque,
        valorResgate8: dadosSimulacao.Saque8,
        rendaMensal: dadosSimulacao.RendaMensal
      });

      await this.page.current.loading(false);
    }
  }

  render() {
    return (
      <Page {...this.props} ref={this.page}>
        {this.props.location.state &&
          <Box titulo={"Resultados"}>
            <h2>Importante!</h2>
            <h5 className={"mb-5 mt-3"}>
              Todos os valores desta simulação foram apurados considerando as informações por você fornecidas.
              As rentabilidades e benefícios projetados são unicamente referências, não constituindo nenhuma garantia
              por parte da Fundação São Francisco.
            </h5>

            <h4 className={"mt-5 mb-2"}>Idade Atual</h4>
            <h5 className={"text-secondary"}><CampoEstatico valor={this.state.idadeAtual} /></h5>

            <h4 className={"mt-5 mb-2"}>Idade na Aposentadoria</h4>
            <h5 className={"text-secondary"}><CampoEstatico valor={this.state.idadeAposentadoria} /></h5>

            <Row>
              <Col>
                <h4 className={"mt-5 mb-2"}>Saldo Projetado Acumulado *</h4>
                <h6>(*caso optar por {this.props.location.state.percentualContrib}% de contribuição)</h6>
                <h5 className={"text-secondary"}><CampoEstatico valor={this.state.saldoProjetado5} tipo={TipoCampoEstatico.dinheiro} /></h5>
              </Col>
              <Col>
                <h4 className={"mt-5 mb-2"}>Saldo Projetado Acumulado *</h4>
                <h6>(*caso optar por 8% de contribuição: a patrocinadora também contribuirá para você até no máximo 8%)</h6>
                <h5 className={"text-secondary"}><CampoEstatico valor={this.state.saldoProjetado8} tipo={TipoCampoEstatico.dinheiro} /></h5>
              </Col>
            </Row>

            <Row>
              <Col>
                <h4 className={"mt-5 mb-2"}>Valor do Resgate à Vista *</h4>
                <h6>(*caso optar por {this.props.location.state.percentualContrib}% de contribuição)</h6>
                <h5 className={"text-secondary"}><CampoEstatico valor={this.state.valorResgate5} tipo={TipoCampoEstatico.dinheiro} /></h5>
              </Col>

              <Col>
                <h4 className={"mt-5 mb-2"}>Valor do Resgate à Vista *</h4>
                <h6>(*caso optar por 8% de contribuição: a patrocinadora também contribuirá para você até no máximo 8%)</h6>
                <h5 className={"text-secondary"}><CampoEstatico valor={this.state.valorResgate8} tipo={TipoCampoEstatico.dinheiro} /></h5>
              </Col>
            </Row>

            <h4 className={"mt-5 mb-2"}>Renda Mensal Inicial</h4>
            <h5 className={"mb-5 mt-3"}>
              Os Benefícios sob a forma de renda mensal corresponderão ao valor obtido pela aplicação de um percentual,
              de até 1,5% (um e meio por cento), do Saldo de Conta Aplicável existente ao final do mês de referência do benefício.
            </h5>

            <table className={"table table-striped table-sm"}>
              <thead>
                <tr>
                  <th>Percentual</th>
                  <th>Renda Mensal (contrib {this.props.location.state.percentualContrib}%)</th>
                  <th>Renda Mensal (contrib 8%)</th>
                  <th>Tempo de Recebimento (13 parcelas anuais)</th>
                </tr>
              </thead>
              <tbody>
                {this.state.rendaMensal.map((rendaMensal: RendaMensal, index) => {
                  return (
                    <tr key={index}>
                      <td>{rendaMensal.Percentual}%</td>
                      <td><CampoEstatico valor={rendaMensal.Renda} tipo={TipoCampoEstatico.dinheiro} /></td>
                      <td><CampoEstatico valor={rendaMensal.Renda8} tipo={TipoCampoEstatico.dinheiro} /></td>
                      <td>{rendaMensal.StringTempoRecebimento}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <br /><br />
            <Botao titulo={"Nova Simulação"} tipo={TipoBotao.primary} submit onClick={() => this.props.history.goBack()} />
          </Box>
        }
      </Page>
    );
  }
}

function formatValue(val: string) {
  return parseFloat(
    val.replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
  );
}
