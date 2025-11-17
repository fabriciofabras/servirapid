const handleSendWhatsApp = async (orderId) => {
  try {
    // 1. Genera el PDF desde tu backend
    const res = await fetch(`/api/orden/${orderId}/pdf`);
    const data = await res.json(); // response: { url: "https://..." }

    const pdfUrl = data.url;

    // 2. Descarga local por si la quiere el usuario
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `orden-${orderId}.pdf`;
    link.click();

    // 3. Arma el mensaje de WhatsApp
    const message = `Hola, aquí tienes tu orden:\n${pdfUrl}`;
    const phone = "521XXXXXXXXXX"; // tu número o el del cliente

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // 4. Abre WhatsApp
    window.open(whatsappUrl, "_blank");

  } catch (err) {
    console.error(err);
    alert("Hubo un error enviando la orden.");
  }
};
