import { dadataClient } from "./dadataClient";

const REGION_FIAS = process.env.EXPO_PUBLIC_DADATA_FIAS_ID || "";

type DaDataSuggestResp<T = any> = {
    suggestions: Array<{ value: string; data: T }>;
};

export type CityOption = {
    label: string;
    fiasId: string;
    kind: "city" | "settlement";
};
export type StreetOption = { label: string; fiasId: string };

const COUNTRY_ISO = "RU"; // при необходимости сделайте параметром
const MIN_Q = 3;

// Подсказки для города/села
export async function suggestCity(
    query: string,
    countryIso = COUNTRY_ISO,
    signal?: AbortSignal
): Promise<CityOption[]> {
    const q = query.trim();
    if (q.length < MIN_Q) return [];

    const body = {
        query: q,
        count: 10,
        language: "ru",
        from_bound: { value: "city" },
        to_bound: { value: "settlement" },
        locations: REGION_FIAS
            ? [{ region_fias_id: REGION_FIAS }]
            : [{ country_iso_code: "RU" }],
        restrict_value: false,
    };

    const { data } = await dadataClient.post<DaDataSuggestResp>("", body, {
        signal,
    });

    return (data?.suggestions ?? [])
        .map((s) => {
            const d = s.data as any;
            // Приоритет: точное совпадение с запросом, затем settlement, затем city
            let label = s.value; // Используем точное значение из DaData
            const fiasId = d.settlement_fias_id || d.city_fias_id;
            const kind: "city" | "settlement" = d.settlement_fias_id
                ? "settlement"
                : "city";
            return fiasId ? { label, fiasId, kind } : null;
        })
        .filter(Boolean) as CityOption[];
}

// Подсказки для улицы (по выбранному городу/селу)
export async function suggestStreet(
    query: string,
    parent: { fiasId: string; kind: "city" | "settlement" },
    signal?: AbortSignal
): Promise<StreetOption[]> {
    const q = query.trim();
    if (q.length < MIN_Q || !parent?.fiasId) return [];

    const locations =
        parent.kind === "city"
            ? [{ city_fias_id: parent.fiasId }]
            : [{ settlement_fias_id: parent.fiasId }];

    const body = {
        query: q,
        count: 10,
        language: "ru",
        from_bound: { value: "street" },
        to_bound: { value: "street" },
        locations,
        restrict_value: true,
    };

    const { data } = await dadataClient.post<DaDataSuggestResp>("", body, {
        signal,
    });

    return (data?.suggestions ?? [])
        .map((s) => {
            const d = s.data as any;
            const label = d.street_with_type || s.value;
            const fiasId = d.street_fias_id;
            return fiasId ? { label, fiasId } : null;
        })
        .filter(Boolean) as StreetOption[];
}
