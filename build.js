const { filesystem, prompt, system } = require('gluegun');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    var package = JSON.parse(filesystem.read("./package.json"));
    var versao = package.version;
    versao = versao.split(".");

    var major = Number.parseInt(versao[0]);
    var minor = Number.parseInt(versao[1]);
    var build = Number.parseInt(versao[2]);

    var { newVersion } = await prompt.ask({
        type: "select",
        name: "newVersion",
        message: "Selecione o novo número de versão:",
        choices: [
            `${major + 1}.0.0`,
            `${major}.${minor + 1}.0`,
            `${major}.${minor}.${build + 1}`,
            `${major}.${minor}.${build}`
        ]
    });

    package.version = newVersion;

    await filesystem.writeAsync("./package.json", JSON.stringify(package, null, 4));

    await sleep(300);

    var env = JSON.parse(filesystem.read("./env.json"));
    var envList = Object.getOwnPropertyNames(env);

    var { selectedEnv } = await prompt.ask({
        type: "select",
        name: "selectedEnv",
        message: "Selecione um ambiente:",
        choices: envList
    });

    filesystem.write("./src/config.json", env[selectedEnv]);

    console.log(env[selectedEnv]);

    console.log("Realizando build...");

    try {
        await system.run("react-scripts build")
        console.log("Build realizado com sucesso!");
    } catch(e) {
        throw e;
    }

    if(env[selectedEnv].dir) {
        var { publish } = await prompt.ask({
            type: "select",
            name: "publish",
            message: "Deseja publicar esta versão?",
            choices: ["Sim", "Não"]
        });

        if(publish === "Não")
            return;

        var distPath = filesystem.find(env[selectedEnv].dir, { matching: ["*.js", "*.css", "*.map"] });
        distPath.forEach((file) => {
            filesystem.remove(file);
        });

        filesystem.copy("./build", env[selectedEnv].dir, { overwrite: true });
        console.log("Publicado com sucesso!");
    }
})();