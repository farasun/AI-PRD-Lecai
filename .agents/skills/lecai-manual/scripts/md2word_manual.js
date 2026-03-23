/**
 * Phase 5b — 手册 Word 生成器
 * 将结构化 JSON + 模板配置生成 Word 文档（docx-js）
 *
 * 用法:
 *   node scripts/md2word_manual.js /tmp/manual_structured.json manual/templates/001-老年大学团长.json -o manual/output.docx --frames-dir manual/frames
 */

const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, ImageRun,
        Header, Footer, AlignmentType, HeadingLevel,
        PageNumber, PageBreak } = require('docx');

// === 参数解析 ===
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('用法: node md2word_manual.js <structured.json> <template.json> [-o output.docx] [--frames-dir dir]');
    process.exit(1);
}

const dataPath = args[0];
const templatePath = args[1];
let outputPath = 'output.docx';
let framesDir = '.';

for (let i = 2; i < args.length; i++) {
    if (args[i] === '-o' && args[i + 1]) { outputPath = args[++i]; }
    if (args[i] === '--frames-dir' && args[i + 1]) { framesDir = args[++i]; }
}

// === 加载数据 ===
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
const typo = template.typography;

console.log(`📖 生成 Word: ${data.title}`);
console.log(`🎨 模板: ${template.template_name}`);

// === 辅助函数 ===
function ptToHalfPt(pt) { return pt * 2; }
function inchToDxa(inch) { return Math.round(inch * 1440); }
function inchToEmu(inch) { return Math.round(inch * 914400); }

function getImageDimensions(imgPath) {
    // 读取 JPEG 尺寸
    const buf = fs.readFileSync(imgPath);
    let w = 0, h = 0;

    // JPEG SOF marker
    for (let i = 0; i < buf.length - 8; i++) {
        if (buf[i] === 0xFF && (buf[i + 1] === 0xC0 || buf[i + 1] === 0xC2)) {
            h = buf.readUInt16BE(i + 5);
            w = buf.readUInt16BE(i + 7);
            break;
        }
    }
    return { width: w || 720, height: h || 1280 };
}

function loadImage(imageSrc) {
    // 解析相对路径
    let imgPath = imageSrc;
    if (imageSrc.startsWith('./frames/') || imageSrc.startsWith('frames/')) {
        const filename = path.basename(imageSrc);
        imgPath = path.join(framesDir, filename);
    }

    if (!fs.existsSync(imgPath)) {
        console.warn(`   ⚠️ 图片不存在: ${imgPath}`);
        return null;
    }

    const imgData = fs.readFileSync(imgPath);
    const dims = getImageDimensions(imgPath);
    const aspectRatio = dims.width / dims.height;

    // 双约束缩放：先按宽度，再检查高度上限
    const maxWidthInch = typo.image.width_inch || 4;
    const maxHeightCm = typo.image.max_height_cm || 12;
    const maxHeightInch = maxHeightCm / 2.54;

    // Step 1: 按宽度缩放
    let finalWidthPx = maxWidthInch * 96;
    let finalHeightPx = finalWidthPx / aspectRatio;

    // Step 2: 如果高度超限，以高度为准重新缩放
    const maxHeightPx = maxHeightInch * 96;
    if (finalHeightPx > maxHeightPx) {
        finalHeightPx = maxHeightPx;
        finalWidthPx = finalHeightPx * aspectRatio;
    }

    finalWidthPx = Math.round(finalWidthPx);
    finalHeightPx = Math.round(finalHeightPx);

    return {
        data: imgData,
        width: finalWidthPx,
        height: finalHeightPx
    };
}

// === 构建文档内容 ===
const children = [];

// 1. 文档标题
children.push(new Paragraph({
    alignment: typo.doc_title.alignment === 'center' ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { after: 200 },
    children: [new TextRun({
        text: data.title,
        bold: typo.doc_title.bold,
        size: ptToHalfPt(typo.doc_title.size_pt),
        font: typo.font_family,
        color: typo.color
    })]
}));

// 2. 副标题
if (data.subtitle) {
    const subtitleLines = data.subtitle.split('\n');
    subtitleLines.forEach(line => {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({
                text: line,
                size: ptToHalfPt(12),
                font: typo.font_family,
                color: '666666'
            })]
        }));
    });
    children.push(new Paragraph({ spacing: { after: 300 }, children: [] }));
}

// 3. 章节与步骤
let stepGlobalNum = 0;
data.chapters.forEach((chapter, chIdx) => {
    // 章节标题
    children.push(new Paragraph({
        spacing: {
            before: ptToHalfPt(typo.chapter_title.spacing_before_pt) * 10,
            after: ptToHalfPt(typo.chapter_title.spacing_after_pt) * 10
        },
        children: [new TextRun({
            text: chapter.title,
            bold: typo.chapter_title.bold,
            size: ptToHalfPt(typo.chapter_title.size_pt),
            font: typo.font_family,
            color: typo.color
        })]
    }));

    chapter.steps.forEach((step, stepIdx) => {
        stepGlobalNum++;

        // 步骤标题 - 根据模板决定用 friendly_name 还是 page_name
        const titleText = template.content_rules.use_friendly_names
            ? step.friendly_name
            : step.page_name;

        // 根据模板决定是否显示编号前缀
        const showId = template.content_rules.show_page_id && step.page_id;
        const displayTitle = showId
            ? `${step.page_id} · ${titleText}`
            : titleText;

        children.push(new Paragraph({
            spacing: {
                before: ptToHalfPt(typo.step_title.spacing_before_pt) * 10,
                after: ptToHalfPt(typo.step_title.spacing_after_pt) * 10
            },
            children: [new TextRun({
                text: `${stepIdx + 1}. ${displayTitle}`,
                bold: typo.step_title.bold,
                size: ptToHalfPt(typo.step_title.size_pt),
                font: typo.font_family,
                color: typo.color
            })]
        }));

        // 截图
        if (step.image) {
            const img = loadImage(step.image);
            if (img) {
                children.push(new Paragraph({
                    alignment: typo.image.alignment === 'center' ? AlignmentType.CENTER : AlignmentType.LEFT,
                    spacing: { before: 100, after: 100 },
                    children: [new ImageRun({
                        type: 'jpg',
                        data: img.data,
                        transformation: { width: img.width, height: img.height },
                        altText: {
                            title: displayTitle,
                            description: step.description || displayTitle,
                            name: `step_${stepGlobalNum}`
                        }
                    })]
                }));
            }
        }

        // 描述文本
        if (step.description) {
            children.push(new Paragraph({
                spacing: {
                    after: ptToHalfPt(typo.body_text.spacing_after_pt) * 10
                },
                children: [new TextRun({
                    text: step.description,
                    size: ptToHalfPt(typo.body_text.size_pt),
                    font: typo.font_family,
                    color: typo.color
                })]
            }));
        }

        // 步骤间分隔
        children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
    });
});

// === 创建文档 ===
const marginDxa = inchToDxa(template.layout.margins_inch || 1);

const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: typo.font_family,
                    size: ptToHalfPt(typo.body_text.size_pt),
                    color: typo.color
                }
            }
        }
    },
    sections: [{
        properties: {
            page: {
                size: { width: 12240, height: 15840 },
                margin: { top: marginDxa, right: marginDxa, bottom: marginDxa, left: marginDxa }
            }
        },
        footers: {
            default: new Footer({
                children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ children: [PageNumber.CURRENT], size: ptToHalfPt(10), color: '999999' })
                    ]
                })]
            })
        },
        children: children
    }]
});

// === 生成文件 ===
Packer.toBuffer(doc).then(buffer => {
    // 确保输出目录存在
    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir, { recursive: true }); }

    fs.writeFileSync(outputPath, buffer);
    console.log(`\n✅ Word 文档生成成功!`);
    console.log(`   📄 文件: ${outputPath}`);
    console.log(`   📦 大小: ${(buffer.length / 1024).toFixed(1)} KB`);
    console.log(`   📚 章节: ${data.chapters.length}`);
    console.log(`   📝 步骤: ${stepGlobalNum}`);
}).catch(err => {
    console.error('❌ 生成失败:', err);
    process.exit(1);
});
