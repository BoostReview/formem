import QRCode from "qrcode"

/**
 * Générer un QR code en data URL (PNG)
 */
export async function generateQRCode(url: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 300,
    })

    return dataUrl
  } catch (error) {
    console.error("Erreur lors de la génération du QR code:", error)
    throw new Error("Impossible de générer le QR code")
  }
}

/**
 * Générer un QR code en SVG
 */
export async function generateQRCodeSVG(url: string): Promise<string> {
  try {
    const svg = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 300,
    })

    return svg
  } catch (error) {
    console.error("Erreur lors de la génération du QR code SVG:", error)
    throw new Error("Impossible de générer le QR code SVG")
  }
}


