import { createRouter, createWebHistory } from "vue-router";
import SnippetList from "../views/SnippetList.vue";
import SnippetForm from "../views/SnippetForm.vue";
import SnippetDetail from "../views/SnippetDetail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: SnippetList,
    },
    {
      path: "/snippets/new",
      name: "new-snippet",
      component: SnippetForm,
    },
    {
      path: "/snippets/:id",
      name: "snippet-detail",
      component: SnippetDetail,
    },
    {
      path: "/snippets/:id/edit",
      name: "edit-snippet",
      component: SnippetForm,
    },
  ],
});

export default router;
