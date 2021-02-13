const path = require("path");
var fs = require('fs');
const sharp = require("sharp")
const marked = require("marked");
const matter = require("gray-matter");
const formatDate = require("date-fns/format");

const renderer = new marked.Renderer();
const linkRenderer = renderer.link;

renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text);

  if (href.indexOf("/") === 0) {
    // Do not open internal links on new tab
    return html;
  } else if (href.indexOf("#") === 0) {
    // Handle hash links to internal elements
    const html = linkRenderer.call(renderer, "javascript:;", title, text);
    return html.replace(
      /^<a /,
      `<a onclick="document.location.hash='${href.substr(1)}';" `
    );
  }

  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
};

const images = []

renderer.image = (href, title, text) => {

    const initialImageDir = href.split(".")[0]
    const imageDir = "static" + initialImageDir;
    const pathToInput = path.resolve("static" + href);

    // create  the image directory if it doesn't already exist 
    if (!fs.existsSync(imageDir)){
        fs.mkdirSync(imageDir);
        // TODO check that the images exist (this assumes they do not!)
        sharp(pathToInput).resize(30).toFile(path.resolve(imageDir + "/tiny.webp"))
        // create a thumbnail version of the image
         sharp(pathToInput).resize(200).toFile(path.resolve(imageDir + "/thumbnail.webp"))
        // create a big version of the image 
         sharp(pathToInput).resize(900).toFile(path.resolve(imageDir + "/large.webp"))
    }

    images.push({href, title, text, tiny: initialImageDir + "/tiny.webp", thumbnail: initialImageDir + "/thumbnail.webp", large: initialImageDir + "/large.webp"})
    return "<img />"
}

marked.setOptions({ renderer });

export default () => ({
  transform(md, id) {
    if (!/\.md$/.test(id)) return null;

    const fileName = path.basename(id);
    const { data, content: rawContent } = matter(md);
    const { title, date, image, category } = data;
    const slug = fileName.split(".")[0];
    let content = rawContent;

    // split the html into sections divided by images
    const html =  marked(content).replace(/^\t{3}/gm, '').split("<img />");
    const printDate = formatDate(new Date(date), "MMM D, YYYY");

    const exportFromModule = JSON.stringify({
      title: title || slug,
      slug,
      html,
      images,
      date,
      image,
      category,
      printDate,
    });

    return {
      code: `export default ${exportFromModule}`,
      map: { mappings: "" },
    };
  },
});