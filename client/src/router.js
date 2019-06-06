import Router from 'vue-router';
// eslint-disable-next-line
import authMdw from './middlewares/auth-middleware';

// Page Layout
import Page from './layouts/Page.vue';

// Home
import Home from './views/Home.vue';
import Login from './views/Login.vue';
const PageNotFound = () => import(/* webpackChunkName: "pagenotfound" */ './views/PageNotFound.vue');
const About = () => import(/* webpackChunkName: "about" */ './views/About.vue');

// Dashboard
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ './layouts/dashboard');
const MyEvents = () => import(/* webpackChunkName: "my-events" */ './views/dashboard/MyEvents.vue');
const CoopEvents = () => import(/* webpackChunkName: "coop-events" */ './views/dashboard/CoopEvents.vue');
const ActivityLogs = () => import(/* webpackChunkName: "activity-logs" */ './views/dashboard/ActivityLogs.vue');

// Admin
const AdminLayout = () => import(/* webpackChunkName: "admin" */ './layouts/admin');
const AdminQuestions = () => import(/* webpackChunkName: "admin-questions" */ './views/admin/Questions.vue');
const AdminIdeas = () => import(/* webpackChunkName: "admin-ideas" */ './views/admin/Ideas.vue');
const AdminPolls = () => import(/* webpackChunkName: "admin-polls" */ './views/admin/Polls.vue');
const AdminAnalytics = () => import(/* webpackChunkName: "admin-analytics" */ './views/admin/Analytics.vue');

// Guest
const GuestLayout = () => import(/* webpackChunkName: "guest" */ './layouts/guest');
const GuestQuestions = () => import(/* webpackChunkName: "guest-questions" */ './views/guest/Questions.vue');
const GuestIdeas = () => import(/* webpackChunkName: "guest-ideas" */ './views/guest/Ideas.vue');
const GuestPolls = () => import(/* webpackChunkName: "guest-polls" */ './views/guest/Polls.vue');

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			component: Page,
			redirect: { name: 'home' },
			children: [
				{
					path: '/',
					name: 'home',
					component: Home,
					meta: {
						title: 'Sliding - Event Supporter'
					}
				},
				{
					path: 'about',
					name: 'about',
					component: About,
					meta: {
						title: 'About'
					}
				},
				{
					path: 'login',
					name: 'login',
					component: Login,
					meta: {
						title: 'Login'
					}
				},
				{
					path: 'dashboard',
					name: 'dashboard',
					component: Dashboard,
					beforeEnter: authMdw.guard,
					redirect: { name: 'my-events' },
					children: [
						{
							path: 'my-events',
							name: 'my-events',
							component: MyEvents,
							meta: {
								title: 'My Events'
							}
						},
						{
							path: 'coop-events',
							name: 'coop-events',
							component: CoopEvents,
							meta: {
								title: 'Co-op Events'
							}
						},
						{
							path: 'activity-logs',
							name: 'activity-logs',
							component: ActivityLogs,
							meta: {
								title: 'Activity Logs'
							}
						}
					]
				},
				{
					path: 'admin/event/:code',
					component: AdminLayout,
					redirect: { name: 'admin-questions' },
					children: [
						{
							path: 'questions',
							name: 'admin-questions',
							component: AdminQuestions,
							meta: {
								title: 'Questions'
							}
						},
						{
							path: 'polls',
							name: 'admin-polls',
							component: AdminPolls,
							meta: {
								title: 'Polls'
							}
						},
						{
							path: 'ideas',
							name: 'admin-ideas',
							component: AdminIdeas,
							meta: {
								title: 'Ideas'
							}
						},
						{
							path: 'analytics',
							name: 'admin-analytics',
							component: AdminAnalytics,
							meta: {
								title: 'Analytics'
							}
						}
					]
				},
				{
					path: 'guest/event/:code',
					component: GuestLayout,
					redirect: { name: 'guest-questions' },
					children: [
						{
							path: 'questions',
							name: 'guest-questions',
							component: GuestQuestions,
							meta: {
								title: 'Questions'
							}
						},
						{
							path: 'polls',
							name: 'guest-polls',
							component: GuestPolls,
							meta: {
								title: 'Polls'
							}
						},
						{
							path: 'ideas',
							name: 'guest-ideas',
							component: GuestIdeas,
							meta: {
								title: 'Ideas'
							}
						}
					]
				},
				{
					path: '*',
					name: 'page-not-found',
					component: PageNotFound,
					meta: {
						title: 'Page Not Found'
					}
				}
			]
		}
	]
});

router.afterEach((to, from) => {
	document.title = `${to.meta.title || ' '}`;
});

export default router;
