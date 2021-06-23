import { Alerta, TipoAlerta } from "@intechprev/componentes-web";
import React, { useState } from "react";
import axios from "axios";

import config from "../../config.json";

interface IProps {
  onFinish: (oid: number) => void;
}

export const Upload: React.FC<IProps> = ({ onFinish }) => {
  const [Error, setError] = useState("");
  const [Uploading, setUploading] = useState(false);
  const [Uploaded, setUploaded] = useState(false);
  const [UploadProgress, setUploadProgress] = useState(0);

  async function handleAnexar(e: any) {
    try {
      setUploading(true);
      setUploaded(false);
      setError("");

      let arquivoUpload = e.target.files[0];

      const formData = new FormData();
      formData.append("File", arquivoUpload, arquivoUpload.name);

      const token = await localStorage.getItem(`@${config.appName}:token`);
      console.log({ token });

      let { data: oid } = await axios.post(config.apiUrl + "/adesao/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });

      onFinish(oid);
      setUploaded(true);
    } catch (e) {
      setError(e.response.data ?? e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      {Uploading && (
        <>
          <h4>Enviando arquivo...</h4>
          <div className="progress" style={{ marginBottom: 10 }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: UploadProgress + "%" }}
              aria-valuenow={50}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </>
      )}

      {!Uploaded && !Uploading && <input name="selecionar-documento" id="selecionar-documento" type="file" onChange={handleAnexar} />}

      {Uploaded && !Uploading && !Error && <Alerta tipo={TipoAlerta.success} mensagem={"Arquivo enviado com sucesso"} />}
      {!Uploading && Error && <Alerta tipo={TipoAlerta.danger} mensagem={Error} />}
    </>
  );
};
