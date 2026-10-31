import { submitContact } from "../src/app/actions/submitContact";

async function main() {
  if (
    process.argv.length !== 3 ||
    process.argv[2] !== "--send-one-test-email"
  ) {
    console.error(
      "Refusing to send: explicit --send-one-test-email authorization is required.",
    );
    process.exitCode = 1;
    return;
  }

  const result = await submitContact({
    name: "Тест",
    country: "MD",
    phone: "069123456",
    comment:
      "Синтетическая тестовая заявка Math BAC. Не связывайтесь по указанному номеру.",
  });
  console.log(
    `Contact smoke-test status: ${result.status}. Provider acceptance does not prove inbox delivery.`,
  );
  if (result.status !== "accepted") process.exitCode = 1;
}

main().catch(() => {
  console.error(
    "Smoke test failed; outcome may be uncertain. Do not automatically retry.",
  );
  process.exitCode = 1;
});
