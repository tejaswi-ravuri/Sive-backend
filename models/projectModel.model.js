import mongoose from "mongoose";

const data = new mongoose.Schema({
    title: { type: String, required: true },
    photographer: { type: String, required: true},
    location: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true},
    imagesurl:[{ type: String, required: true }],
    date: { type: Date, default: Date.now },
});

const ProjectData = mongoose.model("ProjectData", data);
export default ProjectData;