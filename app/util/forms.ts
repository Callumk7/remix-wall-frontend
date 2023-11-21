export async function getFormValues(
  keys: string[],
  request: Request,
): Promise<Record<string, string | undefined>> {
  const formData = await request.formData();
  const formValues: Record<string, string | undefined> = {};

  keys.forEach((key) => {
    formValues[key] = formData.get(key)?.toString();
  });

  return formValues;
}

