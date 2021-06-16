import React, { useEffect } from "react";
import { Page } from "..";
import { Alerta, Box, TipoAlerta } from "@intechprev/componentes-web";

export const Adesao: React.FC = ({ ...props }) => {
  const page = React.createRef<Page>();

  useEffect(() => {
    page.current.loading(false);
  }, []);

  return (
    <Page {...props} ref={page}>
      <Box>
        <Alerta tipo={TipoAlerta.info} mensagem={"Em construção."} />
      </Box>
    </Page>
  );
}