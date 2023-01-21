import { load } from 'cheerio'
import prism from 'remark-prism'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const highlightHref = (text) => {
  const $ = load(`<html><head></head><body>${text}</body></html>`)
  $('a').each((_, i) => {
    $(i).addClass('text-blue-600')
  })
  return $('body').html()
}

export const markdown2HTML = async (markdown, highlightHrefs = true) => {
  let result = await unified().use(remarkParse).use(prism).use(remarkRehype).use(rehypeStringify).process(markdown)
  if (highlightHrefs) {
    result = highlightHref(result)
  }
  return result
}
