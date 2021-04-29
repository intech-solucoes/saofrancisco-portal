import React from "react";
import { Page } from "..";
import { Row, Col, Box, CampoEstatico, TipoCampoEstatico, Combo, Alerta, TipoAlerta } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { PlanoService, FichaFinanceiraService, FichaFechamentoService } from "@intechprev/prevsystem-service";

import * as _ from "lodash";

interface Props {
  page: any;
  plano: any;
}

interface State {
  planos: Array<any>;
  plano: any;
  cdPlano: string;
  salario: any;
  ultimaContribuicao: any;
  saldos: any;
}

export class HomeAtivo extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      planos: [],
      plano: props.plano,
      cdPlano: props.plano.CD_PLANO,
      salario: {},
      ultimaContribuicao: null,
      saldos: null
    }
  }

  componentDidMount = async () => {
    this.props.page.current.loading(true);

    await this.carregarPlano();

    this.props.page.current.loading(false);
  }

  selecionarPlano = async (plano: any) => {
    this.props.page.current.loading(true);

    await this.setState({
      plano,
      cdPlano: plano.CD_PLANO,
    });

    await this.carregarPlano();

    this.props.page.current.loading(false);
  }

  carregarPlano = async () => {
    try {
      this.props.page.current.loading(true);
      var ultimaContribuicao = await FichaFinanceiraService.BuscarUltimaExibicaoPorPlano(this.state.cdPlano);
      var saldos = await FichaFechamentoService.BuscarSaldoPorPlano(this.state.cdPlano);

      this.setState({
        ultimaContribuicao,
        saldos
      });
      this.props.page.current.loading(false);
    } catch (err) {
      if (err.response) {
        alert(err.response.data);
      } else {
        alert(err);
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.ultimaContribuicao &&
          <div>
            <Row>
              <Col>
                <HomeCard titulo={this.state.plano.DS_PLANO}>
                  {this.state.plano.DS_CATEGORIA}
                </HomeCard>
              </Col>
              {typeof this.state.ultimaContribuicao !== "string" &&
                <Col>
                  <HomeCard titulo={"Contribuição Atual"} >
                    {this.state.ultimaContribuicao.Percentual}%
                  </HomeCard>
                </Col>
              }
              {typeof this.state.ultimaContribuicao !== "string" &&
                <Col>
                  <HomeCard titulo={"Salário de Participação"}>
                    <CampoEstatico valor={this.state.ultimaContribuicao.SRC} tipo={TipoCampoEstatico.dinheiro} />
                  </HomeCard>
                </Col>
              }
              <Col>
                <HomeCard titulo={"Data de Inscrição"}>
                  {this.state.plano.DT_INSC_PLANO}
                </HomeCard>
              </Col>
              <Col>
                <HomeCard titulo={"Regime de Tributação"}>
                  {this.state.plano.TIPO_IRRF === "2" ? "Regressivo" : "Progressivo"}
                </HomeCard>
              </Col>
            </Row>

            {typeof this.state.ultimaContribuicao !== "string" &&
              <Row className={"mt-4"}>
                <Col>
                  <Box renderRow={true} titulo={"Sua Última Contribuição"} label={`Posição de ${this.state.ultimaContribuicao.DataReferencia.substring(3)}`}>

                    <table className={"table table-striped table-sm"}>
                      <tbody>
                        {this.state.ultimaContribuicao.Contribuicoes.map((contrib: any, index: number) => {
                          // Define o tipo de linha (td ou th) baseado no index. Se for o ultimo, será o total, e será th
                          var Td = (props: any) => <td className={props.className}>{props.children}</td>;

                          if (index == this.state.ultimaContribuicao.Contribuicoes.length - 1)
                            Td = (props: any) => <th className={props.className}>{props.children}</th>;

                          return (
                            <tr key={index}>
                              <Td>{contrib.Item1}</Td>
                              <Td className={"text-right"}>
                                <CampoEstatico valor={contrib.Item2} tipo={TipoCampoEstatico.dinheiro} />
                              </Td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>

                  </Box>

                  <Box renderRow={true} titulo={"Custeio"} label={`Posição de ${this.state.ultimaContribuicao.DataReferencia.substring(3)}`}>

                    <table className={"table table-striped table-sm"}>
                      <tbody>
                        {this.state.ultimaContribuicao.Descontos.map((desconto: any, index: number) => {
                          // Define o tipo de linha (td ou th) baseado no index. Se for o ultimo, será o total, e será th
                          var Td = (props: any) => <td className={props.className}>{props.children}</td>;

                          if (index == this.state.ultimaContribuicao.Descontos.length - 1)
                            Td = (props: any) => <th className={props.className}>{props.children}</th>;

                          return (
                            <tr key={index}>
                              <Td>{desconto.DS_AGRUPADOR_WEB}</Td>
                              <Td className={"text-right"}>
                                <CampoEstatico valor={desconto.CONTRIB_PARTICIPANTE} tipo={TipoCampoEstatico.dinheiro} />
                              </Td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>

                    <b>Valor Líquido (Contribuição Total - Custeio Total): <CampoEstatico valor={this.state.ultimaContribuicao.Liquido} tipo={TipoCampoEstatico.dinheiro} /></b>

                  </Box>
                </Col>

                <Col>
                  <Box titulo={"Seu Saldo"} label={`Posição de ${this.state.saldos.DT_FECHAMENTO !== undefined ? this.state.saldos.DT_FECHAMENTO.substring(3) : ""}`}>

                    <table className={"table table-borderless table-sm"}>
                      <tbody>
                        <tr>
                          <td>Minhas Contribuições (total):</td>
                          <td className={'text-right'}>
                            <CampoEstatico valor={this.state.saldos.VL_GRUPO1} tipo={TipoCampoEstatico.dinheiro} />
                          </td>
                        </tr>
                        <tr>
                          <td>Contribuições Patronais (total):</td>
                          <td className={'text-right'}>
                            <CampoEstatico valor={this.state.saldos.VL_GRUPO2} tipo={TipoCampoEstatico.dinheiro} />
                          </td>
                        </tr>
                        <tr>
                          <td>Contribuições Totais:</td>
                          <td className={'text-right'}>
                            <CampoEstatico valor={this.state.saldos.VL_GRUPO1 + this.state.saldos.VL_GRUPO2} tipo={TipoCampoEstatico.dinheiro} />
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <hr />

                    <div className={"mb-3 pl-2 pr-2 table"}>
                      Rendimento do Plano:
                                            <p className={"float-right"}>
                        <CampoEstatico valor={this.state.saldos.VL_ACUMULADO - (this.state.saldos.VL_GRUPO1 + this.state.saldos.VL_GRUPO2)} tipo={TipoCampoEstatico.dinheiro} />
                      </p>
                    </div>

                    <div className={"alert alert-success"}>
                      <b>Saldo Acumulado Atualizado:</b>
                      <p className={"float-right"}>
                        <b><CampoEstatico valor={this.state.saldos.VL_ACUMULADO} tipo={TipoCampoEstatico.dinheiro} /></b>
                      </p>
                    </div>

                    <p className={"text-info"}>
                      Valor da cota em {this.state.saldos.DT_FECHAMENTO !== undefined ? this.state.saldos.DT_FECHAMENTO.substring(3) : ""}: <CampoEstatico valor={this.state.saldos.VL_COTA} tipo={TipoCampoEstatico.texto} />
                    </p>
                  </Box>
                </Col>
              </Row>
            }

            {this.state.ultimaContribuicao.msgAdicional &&
              <Alerta tipo={TipoAlerta.danger} mensagem={this.state.ultimaContribuicao.msgAdicional} />
            }
          </div>
        }
      </div>
    );
  }
}