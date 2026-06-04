const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const focusGraph = document.querySelector(".focus-graph");
const graphNodes = document.querySelectorAll(".graph-node");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (header && navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            header.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

if (focusGraph && graphNodes.length > 0) {
    const linkMap = {
        lucas: ["link-lucas-data", "link-lucas-forecasting", "link-lucas-analytics", "link-lucas-ml", "link-lucas-public", "link-lucas-graph", "link-lucas-tennis"],
        data: ["link-lucas-data", "link-data-analytics", "link-data-ml"],
        forecasting: ["link-lucas-forecasting", "link-forecasting-analytics"],
        analytics: ["link-lucas-analytics", "link-data-analytics", "link-forecasting-analytics"],
        ml: ["link-lucas-ml", "link-data-ml"],
        public: ["link-lucas-public", "link-public-graph"],
        graph: ["link-lucas-graph", "link-public-graph"],
        tennis: ["link-lucas-tennis"]
    };

    const clearGraphState = () => {
        focusGraph.classList.remove("has-active");
        focusGraph.querySelectorAll(".is-active").forEach((item) => item.classList.remove("is-active"));
    };

    const setGraphState = (node) => {
        clearGraphState();
        const key = node.dataset.node;
        const links = linkMap[key] || [];

        focusGraph.classList.add("has-active");
        node.classList.add("is-active");
        links.forEach((linkClass) => {
            focusGraph.querySelectorAll(`.${linkClass}`).forEach((link) => link.classList.add("is-active"));
        });
    };

    graphNodes.forEach((node) => {
        node.addEventListener("mouseenter", () => setGraphState(node));
        node.addEventListener("focus", () => setGraphState(node));
        node.addEventListener("mouseleave", clearGraphState);
        node.addEventListener("blur", clearGraphState);
    });
}

if (reducedMotion.matches) {
    document.documentElement.classList.add("reduced-motion");
}
