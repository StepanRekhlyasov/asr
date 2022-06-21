import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/account",
        name: "Home",
        component: () =>
        import("../views/homeView.vue"),
    },
    {
        path: "/account/my-profile",
        name: "My profile",
        component: () =>
        import("../views/myProfile.vue"),
    },
    {
        path: "/account/my-partners",
        name: "My partners",
        component: () =>
        import("../views/myPartners.vue"),
    },
    {
        path: "/account/my-sales-reps",
        name: "Sales rep",
        component: () =>
        import("../views/myPartners.vue"),
    },
    {
        path: "/account/all-partners",
        name: "All partners",
        component: () =>
        import("../views/myPartners.vue"),
    },
    {
        path: "/account/coupons",
        name: "Coupons",
        component: () =>
        import("../views/Coupons.vue"),
    },
    
];

const router = createRouter({
  history: createWebHistory(),
  mode: 'history',
  routes,
});

export default router;
