const path = require("path");
var fs = require("fs");
const sharp = require("sharp");
const marked = require("marked");
const matter = require("gray-matter");
const formatDate = require("date-fns/format");

let images = [];

const generateImagesFromPath = (imagePath) => {
  const initialImageDir = imagePath.split(".")[0];
  const imageDir = "static" + initialImageDir;
  const pathToInput = path.resolve("static" + imagePath);

  // create  the image directory if it doesn't already exist
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);

    sharp(pathToInput)
      .metadata()
      .then((metadata) => {
        const res = {
          vertical: metadata.height > metadata.width,
          horizontal: metadata.height <= metadata.width,
        };
        fs.writeFileSync(
          path.resolve(imageDir + "/meta.json"),
          JSON.stringify(res)
        );
      });
    // TODO check that the images exist (this assumes they do not!)
    sharp(pathToInput)
      .resize(30)
      .toFile(path.resolve(imageDir + "/tiny.png"));

    sharp(pathToInput)
      .resize(500)
      .toFile(path.resolve(imageDir + "/medium.webp"));
    sharp(pathToInput)
      .resize(800)
      .toFile(path.resolve(imageDir + "/large.webp"));

    sharp(pathToInput)
      .resize(500)
      .toFile(path.resolve(imageDir + "/medium.jpg"));
    sharp(pathToInput)
      .resize(800)
      .toFile(path.resolve(imageDir + "/large.jpg"));
  }

  return {
    meta: initialImageDir + "/meta.json",
    tiny: initialImageDir + "/tiny.png",
    medium: {
      webp: initialImageDir + "/medium.webp",
      jpg: initialImageDir + "/medium.jpg",
    },
    large: {
      webp: initialImageDir + "/large.webp",
      jpg: initialImageDir + "/large.jpg",
    },
  };
};

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

renderer.image = (href, title, text) => {
  const newImages = generateImagesFromPath(href);
  images.push({
    href,
    title,
    text,
    ...newImages,
  });
  return "<img />";
};

marked.setOptions({ renderer });

export default () => ({
  transform(md, id) {
    if (!/\.md$/.test(id)) return null;

    const fileName = path.basename(id);
    const { data, content: rawContent } = matter(md);
    const { title, date, image, elts, os, year, url, program } = data;
    const slug = fileName.split(".")[0];
    let content = rawContent;

    images = [];

    // split the html into sections divided by images
    const html = marked(content)
      .replace(/^\t{3}/gm, "")
      .split("<img />");
    const printDate = formatDate(new Date(date), "MMM D, YYYY");
    const mainImage = generateImagesFromPath(image);

    const exportFromModule = JSON.stringify({
      title: title || slug,
      slug,
      html,
      images,
      date,
      elts,
      os,
      year,
      program,
      url,
      image: mainImage,
      printDate,
    });

    return {
      code: `export default ${exportFromModule}`,
      map: { mappings: "" },
    };
  },
});
