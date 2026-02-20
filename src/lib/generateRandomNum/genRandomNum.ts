export function generateNumericCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10); // gera dígito aleatório 0-9
  }
  return code;
}