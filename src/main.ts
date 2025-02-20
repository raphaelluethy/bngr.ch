// some parts were re-used from t3dogg/unduck
import { BangsMap } from "./bangs.ts";
import template from "./template.html?raw";

function getBang() {
    const url = new URL(window.location.href);
    let query = url.searchParams.get("q")?.trim() || "";
    if (!query) {
        renderDefaultPage();
        return null;
    }

    const defaultEngineUrl = url.searchParams.get("e") || "g";
    const engineMatch = defaultEngineUrl.match(/([a-z0-9]+)/i);
    const defaultEngine = engineMatch?.[0] || "g";

    const isPassThrough = query.startsWith("|");
    if (isPassThrough) {
        query = query.slice(1).trim();
    }

    const match = query.match(/!([a-z0-9]+)/i);
    const potentialBang = match?.[1];
    const bangName = isPassThrough
        ? defaultEngine
        : potentialBang || defaultEngine;

    const bang = BangsMap.get(bangName);

    // Remove the first bang from the query
    const cleanQuery = isPassThrough
        ? query
        : query.replace(/![a-z0-9]+\s*/i, "").trim();

    // Format of the url is:
    // https://www.google.com/search?q={{{s}}}
    const searchUrl = bang?.u.replace(
        "{{{s}}}",
        // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
        encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
    );
    if (!searchUrl) return null;

    return searchUrl;
}

function doRedirect() {
    const searchUrl = getBang();
    if (!searchUrl) return;
    window.location.replace(searchUrl);
}

function renderDefaultPage() {
    const appDiv = document.getElementById("app");
    if (!appDiv) return;
    appDiv.innerHTML = template;
}

doRedirect();
