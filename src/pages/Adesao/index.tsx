import React, { useEffect } from "react";
import { Page } from "..";
import { Botao, Box, Col, Row } from "@intechprev/componentes-web";
import { Upload } from "./Upload";
import { AdesaoService } from "@intechprev/prevsystem-service";

export const Adesao: React.FC = ({ ...props }) => {
  const page = React.createRef<Page>();

  useEffect(() => {
    page.current.loading(false);
  }, []);

  async function handleDownload() {
    const pdf = await AdesaoService.Download();
    const nomeArquivo = "Formulario de Adesao.pdf";

    if (navigator.msSaveBlob) {
      // IE10+ : (has Blob, but not a[download] or URL)
      return navigator.msSaveBlob(new Blob([pdf]));
    } else {
      const url = window.URL.createObjectURL(new Blob([pdf]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", nomeArquivo);
      document.body.appendChild(link);

      link.click();
      URL.revokeObjectURL(url);
    }
  }

  async function handleFinish(oid: number) {}

  return (
    <Page {...props} ref={page}>
      <Box>
        <Botao titulo="Baixar Arquivo" icone="fa-download" onClick={handleDownload} />
        <br />
        <br />
        <Upload onFinish={handleFinish} />
      </Box>
    </Page>
  );
};
