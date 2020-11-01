import Login from "./components/Login.svelte";
import Logs from "./components/Logs.svelte";
import NewLogEntry from "./components/NewLogEntry.svelte";
import Menu from "./components/Menu.svelte";

const noAuth = {
   "/": Login,
   "*": Login,
};

const authed = {
   "/new-entry": NewLogEntry,
   "/menu": Menu,
   "/logs": Logs,
   "*": Logs,
};

export default {
   noAuth,
   authed,
};
