import React from "react";
import { DocumentoService, PlanoService } from "./../../services";
import {
  DocumentoEntidade,
  DocumentoPastaEntidade,
  PlanoVinculadoEntidade,
} from "./../../entidades";
import { Link } from "react-router-dom";

import { Page } from "..";
import {
  Row,
  Col,
  Box,
  Botao,
  Alerta,
  TipoAlerta,
  TipoBotao,
} from "@intechprev/componentes-web";
import { NumFuncionalidade } from "../Page";

interface Props {
  match?: any;
}

interface State {
  documentos: Array<DocumentoEntidade>;
  oidPasta: number;
  pastas: Array<DocumentoPastaEntidade>;
  pastaAtual: DocumentoPastaEntidade;
  pastaPai: DocumentoPastaEntidade;
  planos: Array<PlanoVinculadoEntidade>;
  selectedOption: string;
}

export class Documentos extends React.Component<Props, State> {
  private options = ["data", "nome"];

  private alerta = React.createRef<Alerta>();
  private page = React.createRef<Page>();

  constructor(props: Props) {
    super(props);

    this.state = {
      documentos: [],
      oidPasta: props.match.params.pasta || 0,
      pastas: [],
      pastaAtual: null,
      pastaPai: null,
      planos: [],
      selectedOption: this.options[0],
    };
  }

  componentDidMount = async () => {
    try {
      await this.page.current.loading(true);
      var planos = await PlanoService.Buscar();

      await this.setState({
        planos,
      });

      await this.buscarLista();
      await this.page.current.loading(false);
    } catch (erro) {
      if (erro.response) {
        alert(erro.response.data);
      } else {
        alert(erro);
      }
    }
  };

  UNSAFE_componentWillReceiveProps() {
    window.location.reload();
  }

  handleOptionChange = (e: any) => {
    const selectedOption = e.target.value;
    this.setState(
      {
        selectedOption,
      },
      this.buscarLista
    );
  };

  buscarLista = async () => {
    var resultado = await DocumentoService.BuscarPorPlanoPasta(
      this.state.planos[0].CD_PLANO,
      this.state.oidPasta,
      this.state.selectedOption
    );

    await this.setState({
      documentos: resultado.documentos,
      pastas: resultado.pastas,
      pastaAtual: resultado.pastaAtual,
      pastaPai: resultado.pastaPai,
    });
  };

  baixarDocumento = async (doc: DocumentoEntidade) => {
    try {
      const documentoInfo = await DocumentoService.BuscarPorOidDocumento(
        doc.OID_DOCUMENTO
      );
      const documento = await DocumentoService.Download(
        doc.OID_DOCUMENTO
      );

      if (navigator.msSaveBlob) {
        // IE10+ : (has Blob, but not a[download] or URL)
        return navigator.msSaveBlob(
          new Blob([documento]),
          documentoInfo.NOM_ARQUIVO_LOCAL
        );
      } else {
        const url = window.URL.createObjectURL(new Blob([documento]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", documentoInfo.NOM_ARQUIVO_LOCAL);
        document.body.appendChild(link);

        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      if (err.response) {
        await this.alerta.current!.adicionarErro(
          "Houve um erro ao baixar o arquivo."
        );
        console.error(err);
        return null;
      }
      await this.alerta.current!.adicionarErro(err);
      console.error(err);
    }
  };

  renderPastaDocumentosTabela = () => {
    if (
      this.state.pastas.length === 0 &&
      this.state.documentos.length === 0
    ) {
      return (
        <Alerta
          mensagem={"Nenhum item disponível."}
          tipo={TipoAlerta.danger}
        />
      );
    }

    return (
      <div>
        <table
          className={
            "table table-sm table-striped table-bordered table-hover"
          }
        >
          <tbody>
            {this.renderPastaTabela()}
            {this.renderDocumentoTabela()}
          </tbody>
        </table>
      </div>
    );
  };

  renderPastaTabela = () => {
    return this.state.pastas.map(
      (pasta: DocumentoPastaEntidade, index: number) => {
        return (
          <tr key={index}>
            <td
              style={{ width: "50px" }}
              className={"align-middle text-center"}
            >
              <i
                className={
                  "fa fa-2x fa-folder-open text-warning"
                }
              ></i>
            </td>
            <td>
              <Link
                className={"btn btn-link"}
                to={`/documentos/${pasta.OID_DOCUMENTO_PASTA}`}
              >
                {pasta.NOM_PASTA}
              </Link>
            </td>
          </tr>
        );
      }
    );
  };

  renderDocumentoTabela = () => {
    return this.state.documentos.map(
      (doc: DocumentoEntidade, index: number) => {
        return (
          <tr key={index}>
            <td
              style={{ width: "50px" }}
              className={"align-middle text-center"}
            >
              <i className={"fa fa-2x fa-file text-info"}></i>
            </td>
            <td>
              <Botao
                onClick={() => this.baixarDocumento(doc)}
                titulo={doc.TXT_TITULO}
                tipo={TipoBotao.link}
                usaLoading
              />
            </td>
          </tr>
        );
      }
    );
  };

  render() {
    return (
      <Page
        Funcionalidade={NumFuncionalidade.DOCUMENTOS}
        {...this.props}
        ref={this.page}
      >
        <Row>
          <Col>
            <Box titulo={"Pastas e Arquivos Disponibilizados"}>
              <Row className={"mb-3"}>
                <Col>
                  <span>
                    <div className={"form-group"}>
                      {"Ordenar Por:"}
                    </div>
                    <div
                      className={
                        "form-check form-check-inline"
                      }
                    >
                      <input
                        className={"form-check-input"}
                        type={"radio"}
                        name={"inlineRadioOptions"}
                        id={"inlineRadio1"}
                        value={this.options[0]}
                        checked={
                          this.state
                            .selectedOption ===
                          this.options[0]
                        }
                        onChange={
                          this.handleOptionChange
                        }
                      />
                      <label
                        className={"form-check-label"}
                        htmlFor={"inlineRadio1"}
                      >
                        {"Data"}
                      </label>
                    </div>
                    <div
                      className={
                        "form-check form-check-inline"
                      }
                    >
                      <input
                        className={"form-check-input"}
                        type={"radio"}
                        name={"inlineRadioOptions"}
                        id={"inlineRadio2"}
                        value={this.options[1]}
                        checked={
                          this.state
                            .selectedOption ===
                          this.options[1]
                        }
                        onChange={
                          this.handleOptionChange
                        }
                      />
                      <label
                        className={"form-check-label"}
                        htmlFor={"inlineRadio2"}
                      >
                        {"Nome"}
                      </label>
                    </div>
                  </span>
                  {this.state.pastaAtual && (
                    <>
                      <Link
                        className={"btn btn-primary"}
                        to={`/documentos/${this.state.pastaPai
                          ? this.state.pastaPai
                            .OID_DOCUMENTO_PASTA
                          : ""
                          }`}
                      >
                        <i
                          className={
                            "fa fa-chevron-left mr-2"
                          }
                        ></i>
                                                Voltar
                                            </Link>
                      <span
                        className={
                          "ml-3 text-info align-self-center"
                        }
                      >
                        {`Pasta atual: ./${this.state.pastaPai
                          ? this.state.pastaPai
                            .NOM_PASTA + "/"
                          : ""
                          }${this.state.pastaAtual
                            .NOM_PASTA
                          }`}
                      </span>
                    </>
                  )}
                </Col>
              </Row>

              <Alerta
                tipo={TipoAlerta.danger}
                ref={this.alerta}
              />

              {this.renderPastaDocumentosTabela()}
            </Box>
          </Col>
        </Row>
      </Page>
    );
  }
}
