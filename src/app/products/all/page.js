import FilteredMenu from "@/app/_components/layout/FilteredMenu";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (retries > 0 && error.name !== "AbortError") {
      console.warn(
        `Fetch failed for ${url}, retrying... (${
          MAX_RETRIES - retries + 1
        }/${MAX_RETRIES})`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export default async function Page() {
  let menu = [];
  let categories = [];
  let hasError = false;
  let errorMessage = "";

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (!baseUrl) {
      throw new Error("NEXTAUTH_URL environment variable not set");
    }

    const [menuRes, categoryRes] = await Promise.all([
      fetchWithRetry(`${baseUrl}/api/products`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      fetchWithRetry(`${baseUrl}/api/categories`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]).catch((error) => {
      console.error("Parallel fetch error:", error);
      throw error;
    });

    // Parse responses
    if (menuRes.ok) {
      try {
        const menuData = await menuRes.json();
        menu = Array.isArray(menuData) ? menuData : [];
      } catch (parseError) {
        console.error("Error parsing menu data:", parseError);
        menu = [];
      }
    } else {
      console.error(`Menu API returned status ${menuRes.status}`);
    }

    if (categoryRes.ok) {
      try {
        const categoryData = await categoryRes.json();
        categories = Array.isArray(categoryData) ? categoryData : [];
      } catch (parseError) {
        console.error("Error parsing category data:", parseError);
        categories = [];
      }
    } else {
      console.error(`Category API returned status ${categoryRes.status}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    hasError = true;
    errorMessage = error.message || "Failed to load products and categories";

    // Continue with empty arrays so page doesn't crash
    menu = [];
    categories = [];
  }

  return (
    <>
      <h1 className="text-[#222] text-left font-bold text-2xl md:text-2xl mb-2 sm:mt-14 p-5 max-w-6xl mx-auto">
        Alle Produkte
      </h1>

      {hasError && (
        <div className="mx-auto max-w-6xl p-5 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">
            Wir konnten die Daten leider nicht laden. Bitte versuchen Sie es
            später erneut.
          </p>
        </div>
      )}

      <FilteredMenu
        menu={menu}
        categories={categories}
        hasLoadingError={hasError}
      />
    </>
  );
}
