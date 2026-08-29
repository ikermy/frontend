import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const swaggerDocument = YAML.load("./swagger.yaml"); // путь к твоему файлу

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("Swagger UI доступен по http://localhost:3000/api-docs");
});
