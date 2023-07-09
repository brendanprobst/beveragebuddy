import { Collection, Snowflake } from "discord.js";
const activeIntervals = new Collection<Snowflake, NodeJS.Timeout>();
export default activeIntervals;
