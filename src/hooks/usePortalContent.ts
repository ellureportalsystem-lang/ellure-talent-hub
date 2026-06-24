import { useCallback, useEffect, useState } from "react";
import {
  fetchActiveBanners,
  fetchActiveFaqs,
  fetchUpcomingWebinars,
  type PortalAudience,
  type PortalBanner,
  type PortalFaq,
  type PortalWebinar,
} from "@/services/portalContentService";

export function usePortalContent(audience: PortalAudience) {
  const [banners, setBanners] = useState<PortalBanner[]>([]);
  const [webinars, setWebinars] = useState<PortalWebinar[]>([]);
  const [faqs, setFaqs] = useState<PortalFaq[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [b, w, f] = await Promise.all([
        fetchActiveBanners(audience),
        fetchUpcomingWebinars(audience),
        fetchActiveFaqs(audience),
      ]);
      setBanners(b);
      setWebinars(w);
      setFaqs(f);
    } catch {
      setBanners([]);
      setWebinars([]);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  }, [audience]);

  useEffect(() => {
    void load();
  }, [load]);

  return { banners, webinars, faqs, loading, reload: load };
}

export function usePortalBanners(audience: PortalAudience) {
  const [banners, setBanners] = useState<PortalBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchActiveBanners(audience)
      .then(setBanners)
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, [audience]);

  return { banners, loading };
}

export function usePortalWebinars(audience: PortalAudience) {
  const [webinars, setWebinars] = useState<PortalWebinar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUpcomingWebinars(audience)
      .then(setWebinars)
      .catch(() => setWebinars([]))
      .finally(() => setLoading(false));
  }, [audience]);

  return { webinars, loading };
}

export function usePortalFaqs(audience: PortalAudience) {
  const [faqs, setFaqs] = useState<PortalFaq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchActiveFaqs(audience)
      .then(setFaqs)
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, [audience]);

  return { faqs, loading };
}
