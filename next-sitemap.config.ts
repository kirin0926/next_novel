// next-sitemap.config.js
module.exports = {
    siteUrl: 'https://nicenovel.org', // 你的网站URL
    generateRobotsTxt: true, // 生成robots.txt
    sitemapSize: 7000, // 每个sitemap文件的最大URL数量
    changefreq: 'daily', // 更新频率
    priority: 0.7, // 优先级
    exclude: ['/server-sitemap.xml'], // 排除的路径
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://nicenovel.org/server-sitemap.xml', // 其他sitemap
      ],
    },
  }