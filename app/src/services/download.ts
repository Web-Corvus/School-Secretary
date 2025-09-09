import api from "@/services/api";

export async function downloadFile(url: string, filename: string) {
  try {
    const response = await api.get(url, {
      responseType: "blob",
    });
    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    alert("Erro ao baixar o arquivo. Verifique sua permissão ou tente novamente.");
  }
}
