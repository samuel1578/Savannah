# Homepage Image Resolution Audit

## 1. Homepage Image Architecture Overview
The Savannah Water Homepage employs a multi-layered resolution strategy to ensure that high-quality CMS-managed assets are served when available, while maintaining visual integrity via local fallbacks.

**The complete flow is as follows:**
1.  **Media Upload:** Assets are uploaded via the Media Library and stored in the `media_assets` table.
2.  **ID Association:** A section field (e.g., `hero_image_id`) stores the integer ID of the asset.
3.  **Backend Resolution:** The PHP API (`get-homepage.php`) detects fields ending in `_id`, queries the `media_assets` table, and injects companion `_url` and `_alt` fields into the response.
4.  **Frontend Consumption:** The `useHomepageCms` hook fetches the data and distributes it to section components.
5.  **URL Normalization:** Components use a helper function to ensure the path is a fully qualified URL.
6.  **Conditional Rendering:** The component checks for the existence of the CMS URL. If present, it renders the remote asset; otherwise, it falls back to a hardcoded local import.

---

## 2. Backend Resolution Layer
**File:** `api/homepage/get-homepage.php`

The backend uses a whitelist of image field keys to trigger resolution. It performs a secondary query for each identified image ID to fetch the file path and alt text.

```php
$imageFields = [
    'hero_image_id',
    'hero_story_card_image_id',
    'map_image_id',
    'palm_banner_image_id',
    'watermaking_image_id',
    'farms_image_id',
    'reviews_image_id',
    'footer_logo_image_id'
];

foreach ($sections as &$section) {
    foreach ($section['fields'] as $field) {
        if (in_array($field['key'], $imageFields) && !empty($field['value'])) {
            $mediaStmt = $db->prepare("SELECT file_path, alt_text FROM media_assets WHERE id = ?");
            $mediaStmt->execute([$field['value']]);
            $media = $mediaStmt->fetch();

            if ($media) {
                $baseKey = str_replace('_id', '', $field['key']);
                $section['fields'][] = [
                    'key' => $baseKey . '_url',
                    'type' => 'url',
                    'value' => $media['file_path']
                ];
                $section['fields'][] = [
                    'key' => $baseKey . '_alt',
                    'type' => 'text',
                    'value' => $media['alt_text']
                ];
            }
        }
    }
}
```

---

## 3. Frontend Data Flow
The data flows through a service-hook-component pipeline:

1.  **Service Layer:** `src/services/homepageCmsService.ts`
    *   Method: `getHomepageData()`
    *   Fetches from `api/homepage/get-homepage.php`.
2.  **Hook Layer:** `src/hooks/useHomepageCms.ts`
    *   Manages `homepageSections`, `products`, and `heritageStories` state.
    *   Exposes data to components via a centralized state.
3.  **Page Layer:** `src/screens/Homepage/Homepage.tsx`
    *   Uses `useHomepageCms()`.
    *   Implements `getSectionData(key)` to filter the flat sections array.
    *   Passes specific section data objects to child components (e.g., `<MapOriginSection data={getSectionData("map_origin")} />`).
4.  **Component Layer:** (e.g., `BrandStoryHeroSection.tsx`)
    *   Extracts values using a `getField` helper.
    *   Normalizes the URL.
    *   Renders with fallback.

---

## 4. Fallback Strategy
Every Homepage section component implements a local asset fallback.

**Pattern:**
```tsx
const cmsImageUrl = getField("field_key_url", "");
const displayImage = cmsImageUrl ? getFullImageUrl(cmsImageUrl) : localAsset;
```

### Implementation Instances:

| File | Component | Field Key | Fallback Asset |
| :--- | :--- | :--- | :--- |
| `BrandStoryHeroSection.tsx` | `BrandStoryHeroSection` | `hero_image_url` | `assets/hero.jpeg` |
| `BrandStoryHeroSection.tsx` | `BrandStoryHeroSection` | `hero_story_card_image_url` | `assets/s.jpg` |
| `MapOriginSection.tsx` | `MapOriginSection` | `map_image_url` | `assets/map.png` |
| `PalmFruitBannerSection.tsx` | `PalmFruitBannerSection` | `palm_banner_image_url` | `assets/selection.png` |
| `WatermakingProcessSection.tsx` | `WatermakingProcessSection` | `watermaking_image_url` | `assets/watermaking.png` |
| `OurFarmsSection.tsx` | `OurFarmsSection` | `farms_image_url` | `assets/farms.png` |
| `ReviewsSection.tsx` | `ReviewsSection` | `reviews_image_url` | `assets/fixedb.jpg` |
| `FooterBrandInviteSection.tsx` | `FooterBrandInviteSection` | `footer_logo_image_url` | `assets/logo-light.png` |

---

## 5. Homepage Image Mapping Table

| CMS Section Key | Field Key (ID) | Resolved Field (URL) | Component |
| :--- | :--- | :--- | :--- |
| `hero_story` | `hero_image_id` | `hero_image_url` | `BrandStoryHeroSection.tsx` |
| `hero_story` | `hero_story_card_image_id` | `hero_story_card_image_url` | `BrandStoryHeroSection.tsx` |
| `map_origin` | `map_image_id` | `map_image_url` | `MapOriginSection.tsx` |
| `palm_selection` | `palm_banner_image_id` | `palm_banner_image_url` | `PalmFruitBannerSection.tsx` |
| `watermaking` | `watermaking_image_id` | `watermaking_image_url` | `WatermakingProcessSection.tsx` |
| `farms_banner` | `farms_image_id` | `farms_image_url` | `OurFarmsSection.tsx` |
| `reviews_banner` | `reviews_image_id` | `reviews_image_url` | `ReviewsSection.tsx` |
| `footer_invite` | `footer_logo_image_id` | `footer_logo_image_url` | `FooterBrandInviteSection.tsx` |

---

## 6. Reusable Pattern
The architecture relies on a **"Shadow Field Resolution"** pattern:

1.  **Normalization Helper:** A standardized utility to handle pathing.
    ```tsx
    const getFullImageUrl = (path: string) => {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        if (path.startsWith("/")) return `https://savannahdrinks.co.uk${path}`;
        return `https://savannahdrinks.co.uk/${path}`;
    };
    ```
2.  **Field Extraction:** A helper to safely access the injected `_url` fields.
    ```tsx
    const getField = (key: string, fallback: string) => {
        return data?.fields.find(f => f.key === key)?.value || fallback;
    };
    ```
3.  **Binary Choice Rendering:**
    ```tsx
    const src = cmsUrl ? getFullImageUrl(cmsUrl) : localAsset;
    ```

---

## 7. About Page Readiness Assessment

### What Already Exists:
*   **Backend Resolution:** `api/about/get-about.php` already implements the resolution logic for `hero_image_id`, `farms_image_id`, timeline `image_id`, craftsmanship `image_id`, and collection `main_image_id`. It correctly injects `image_url` and `image_alt` into the JSON response.
*   **Data Fetching:** `useAboutPageCms` hook is already fetching this data.

### What Is Missing:
*   **Frontend Consumption:** `src/screens/AboutPage/AboutPage.tsx` and its sub-components (e.g., `HeroSection`, `OurStorySection`, `CraftsmanshipSection`) are still using hardcoded local imports (e.g., `import aboutHero from "../../assets/abouthero.jpg"`) directly in the `src` attribute of `<img>` tags.
*   **Normalization Logic:** The `getFullImageUrl` helper is not yet implemented or used in the About page components.
*   **Conditional Logic:** The components do not yet check for the presence of `hero_image_url` or `image_url` from the CMS data.

### Conclusion:
The backend is fully prepared. The "About page fix" required in the next sprint is purely a frontend task: implementing the `getFullImageUrl` helper and updating the `src` attributes to prefer CMS URLs over local assets.
