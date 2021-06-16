import React from "react";
import { Box } from "@intechprev/componentes-web";
import { Link } from "react-router-dom";

export const HomeNaoParticipante: React.FC = () => {

  return (
    <Box>
      <div>
        <b>
          {"Bem Vindo."}
        </b>
      </div>

      <br />

      <Link className={"btn btn-block btn-primary"} to={"/simulador"}>{"Simular Benefício"}</Link>

      <br />

      <Link className={"btn btn-block btn-primary"} to={"/adesao"}>{"Aderir ao plano"}</Link>
    </Box>
  );
}