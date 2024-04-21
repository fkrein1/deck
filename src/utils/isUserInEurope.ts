import axios from "axios";

interface IPAPIResponse {
  country: string;
}

export async function isUserInEurope(
  ipAddress: string | string[] | undefined
): Promise<boolean> {
  console.log(ipAddress);
  if (!ipAddress) return false;

  const individualIpAddress = Array.isArray(ipAddress)
    ? (ipAddress[0] as string)
    : ipAddress;

  try {
    const response = await axios.get<IPAPIResponse>(
      `https://ipapi.co/${individualIpAddress}/json/`
    );
    const country = response.data.country.toUpperCase();
    const europeanCountries = [
      "AT",
      "BE",
      "BG",
      "HR",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HU",
      "IE",
      "IT",
      "LV",
      "LT",
      "LU",
      "MT",
      "NL",
      "PL",
      "PT",
      "RO",
      "SK",
      "SI",
      "ES",
      "SE",
    ];
    return europeanCountries.includes(country);
  } catch (error) {
    console.error("Error fetching IP information:");
    return false;
  }
}
