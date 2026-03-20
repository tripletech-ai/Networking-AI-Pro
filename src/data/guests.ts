export interface Guest {
  name: string;
  chapter: string;
  company: string;
  title: string;
  industry: string;
  services: string;
  lookingFor: string;
  painPoints: string;
}

export const GUESTS: Guest[] = [
  { name: "王執定", chapter: "長輝分會", company: "問大師家族辦公室", title: "CEO", industry: "法律服務", services: "提供企業主全方位顧問整合", lookingFor: "資本額300-1000萬中小企業主", painPoints: "行銷曝光不足" },
  { name: "鄭雅菁", chapter: "長輝分會", company: "千島生活文化有限公司", title: "負責人", industry: "教育培訓", services: "空間租借、瑜珈課程", lookingFor: "企業瑜珈社團、瑜珈老師", painPoints: "師資與場地管理" },
  { name: "施秉辰", chapter: "長輝分會", company: "驊程科技", title: "負責人", industry: "建築營造", services: "弱電設備系統整合", lookingFor: "診所、連鎖門市、中小企業主", painPoints: "客戶不懂設備需求" },
  { name: "李秉誠", chapter: "長輝分會", company: "楓烽管理顧問", title: "業務經理", industry: "資產活化", services: "包租代管、老屋改造", lookingFor: "房仲、建商、投資客", painPoints: "業務拓展與廣告曝光" },
  { name: "楊明翰", chapter: "長輝分會", company: "泰安產物保險", title: "業務專員", industry: "金融保險", services: "產物保險", lookingFor: "上市櫃企業採購", painPoints: "比價競爭" },
  { name: "劉弼凱", chapter: "長輝分會", company: "雷水有限公司", title: "水電工程", industry: "建築營造", services: "水電工程配合", lookingFor: "室內設計師、工程統包", painPoints: "設計師配合太少" },
  { name: "李孟一", chapter: "長輝分會", company: "夢想一號文化教育", title: "創辦人", industry: "教育培訓", services: "魔術方塊教學", lookingFor: "連鎖補習班、私立小學", painPoints: "提高私立小學市佔率" },
  { name: "王祈", chapter: "長輝分會", company: "祈育教育實業坊", title: "負責人", industry: "教育培訓", services: "AI自動化、AI學習", lookingFor: "10-30人企業、私立學校家長", painPoints: "內部流程未清晰" },
  { name: "游凱地", chapter: "長輝分會", company: "鉅成工業", title: "總經理", industry: "建築營造", services: "高機能性地板", lookingFor: "建築師、設計師、建商", painPoints: "需要大量曝光跟送樣" },
  { name: "江沛璇", chapter: "長輝分會", company: "安麗直銷商", title: "直銷商", industry: "健康醫療", services: "營養諮詢", lookingFor: "開業醫師、中醫師", painPoints: "無" },
  { name: "賴永相", chapter: "長輝分會", company: "大象山食品", title: "總經理", industry: "零售業", services: "堅果代工、銷售", lookingFor: "福委會、餐廳", painPoints: "遊覽車客源不足" },
  { name: "李維恩", chapter: "長輝分會", company: "艾思特創新設計", title: "設計總監", industry: "資訊科技", services: "AI、網站、APP開發", lookingFor: "中大型企業主、連續創業家", painPoints: "行銷曝光不足" },
  { name: "李彥慶", chapter: "長輝分會", company: "博拓國際智權集團", title: "CEO", industry: "法律服務", services: "專利、商標", lookingFor: "創新產品中小企業主", painPoints: "無" },
  { name: "彭顯智", chapter: "長輝分會", company: "圭葆有限公司", title: "總經理", industry: "零售業", services: "鍍膜噴劑", lookingFor: "老屋翻新、家政婦、室內設計師", painPoints: "缺乏創意商業模式" },
  { name: "江學洋", chapter: "長輝分會", company: "溫體氣流廣告製作", title: "負責人", industry: "行銷廣告", services: "品牌設計、CIS", lookingFor: "大型廣告代理商、連鎖餐飲", painPoints: "穩定上游發案公司" },
  { name: "黃昱歆", chapter: "長輝分會", company: "讓創意飛媒體", title: "負責人", industry: "行銷廣告", services: "自媒體代操", lookingFor: "營收3000萬企業", painPoints: "接觸客戶群不夠多" },
  { name: "陳育文", chapter: "長輝分會", company: "亞罕設計室內裝修", title: "設計總監", industry: "建築營造", services: "室內設計", lookingFor: "代銷專案經理、建商", painPoints: "行銷曝光不足" },
  { name: "王冠勛", chapter: "長輝分會", company: "長輝照明科技", title: "負責人", industry: "建築營造", services: "照明批發零售", lookingFor: "室內設計師、水電工程", painPoints: "陌生開發困難" },
  { name: "顧心芝", chapter: "長輝分會", company: "禾望品牌", title: "負責人", industry: "行銷廣告", services: "餐飲行銷顧問", lookingFor: "餐飲創業者、食品品牌", painPoints: "精準尋找目標客群" },
  { name: "王銓", chapter: "長輝分會", company: "三人科技顧問", title: "創辦人", industry: "資訊科技", services: "AI自動化、程式設計", lookingFor: "需處理繁瑣重複工作之企業主", painPoints: "內部管理不穩" },
  { name: "吳介輝", chapter: "長輝分會", company: "南山人壽", title: "區經理", industry: "金融保險", services: "資產傳承、保障型保險", lookingFor: "中醫師、復健科醫師", painPoints: "客戶管理以及回覆訊息耗時" },
  { name: "陳亭儒", chapter: "長輝分會", company: "聚元興有限公司", title: "專員", industry: "金融保險", services: "銀行融資、企業貸款", lookingFor: "會計師、律師、記帳師、理財顧問", painPoints: "個人或企業難以取得最佳貸款金額" },
  { name: "洪儀君", chapter: "長輝分會", company: "健甲專家", title: "創辦人", industry: "健康醫療", services: "手足指甲保健", lookingFor: "販售跑鞋的運動用品店、美甲師", painPoints: "技能課程的開課成功率很低" },
  { name: "江心怡", chapter: "長輝分會", company: "光隼資訊有限公司", title: "業務總監", industry: "資訊科技", services: "LINE自動模組、AI影音生成", lookingFor: "預算不足但需短影音行銷的公司", painPoints: "無" },
  { name: "王年煜", chapter: "長輝分會", company: "創達智能技術股份有限公司", title: "執行長", industry: "金融保險", services: "AI程式交易、資產管理", lookingFor: "家族辦公室、保險經紀人", painPoints: "需要更多的業務合作通路來推廣產品" },
  { name: "李慰祖", chapter: "長輝分會", company: "悅爾企業有限公司", title: "總經理", industry: "行銷廣告", services: "團體服裝一條龍服務", lookingFor: "活動公司、大型企業採購", painPoints: "需要精準的行銷曝光與開拓新市場通路" },
  { name: "陳夗媃", chapter: "長輝分會", company: "半日閑企業行", title: "負責人", industry: "餐飲旅遊", services: "澎湖海鮮宅配、外燴", lookingFor: "喜愛澎湖野生魚的家庭、小農商店", painPoints: "行銷曝光不足、無法找到固定引薦對象" },
  { name: "孫成育", chapter: "長輝分會", company: "和朝創意開發有限公司", title: "總經理", industry: "行銷廣告", services: "企業禮贈品、IP週邊規劃", lookingFor: "台灣在地文創商品製造商", painPoints: "台灣製造的工廠越來越少" },
  { name: "林貞妏", chapter: "金佑分會", company: "瀧橒企業股份有限公司", title: "資深顧問", industry: "其他", services: "勞資顧問諮詢、教育訓練", lookingFor: "中小企業主、律師、會計師", painPoints: "找不到合適的顧問一起服務客戶" },
  { name: "呂驛生", chapter: "未知", company: "成騂國際有限公司", title: "負責人", industry: "建築營造", services: "軟裝設計、動線規劃", lookingFor: "新成屋團購主、資深房仲", painPoints: "屋主不懂軟裝，找不到新成屋團購主" },
  { name: "羅光興", chapter: "大耀分會", company: "和泰保經", title: "業務經理", industry: "金融保險", services: "房貸寬限期方案", lookingFor: "有房貸壓力的上班族", painPoints: "有好的方案資源管道，卻不容易被信任" },
  { name: "譚愷悌", chapter: "金澎湃分會", company: "喜喬文化有限公司", title: "負責人", industry: "教育培訓", services: "財富流沙盤培訓", lookingFor: "中小企業，需組織團建", painPoints: "希望能了解AI的使用和幫助" },
  { name: "楊皓宇", chapter: "宏鑫分會", company: "瑞峵財富管理有限公司", title: "主理人", industry: "金融保險", services: "養老規劃、香港保險", lookingFor: "5人以上公司、醫師", painPoints: "高淨值客戶名單增加、合作夥伴找不到" },
  { name: "謝宗佑", chapter: "無", company: "自營業者", title: "導師", industry: "健康醫療", services: "肌應學調和、一對一服務", lookingFor: "運動愛好者、久站久做的上班族", painPoints: "口頭敘述不容易聽得懂" },
  { name: "廖柏晴", chapter: "長虹分會", company: "沃爾林克立體瓷磚有限公司", title: "設計總監", industry: "建築營造", services: "立體瓷磚、磁吸專利", lookingFor: "專營豪宅市場的室內設計師", painPoints: "行銷曝光不足" },
  { name: "王慕煾", chapter: "無", company: "羅森橋未來人才工作室", title: "商務經理", industry: "教育培訓", services: "區塊鏈教育、數位資產配置", lookingFor: "企業主、Web3應用需求者", painPoints: "本地市場認知不足" },
  { name: "蕭旭庭", chapter: "金鑫分會", company: "驊璞有限公司", title: "負責人", industry: "金融保險", services: "金融講座、黃金交易", lookingFor: "30萬台幣以上預算投資者", painPoints: "台灣不適合海外交易推廣" },
  { name: "蘇筠惠", chapter: "金澎湃分會", company: "蘇筠惠風水堪輿", title: "堪輿師", industry: "命理風水", services: "住宅商用風水佈局", lookingFor: "餐飲顧問、企業顧問、商空設計師", painPoints: "人脈鏈接不足" },
  { name: "張婕", chapter: "長城分會", company: "品嘉牙體技術所", title: "總監", industry: "健康醫療", services: "齒模假牙美學", lookingFor: "有牙科疑難雜症的朋友", painPoints: "暫時沒有" },
  { name: "林源鑫", chapter: "金暘分會", company: "篠林空間製作", title: "總監", industry: "建築營造", services: "室內設計與施工", lookingFor: "醫療設備商、診所開業顧問", painPoints: "AI融入工作方式優化" },
  { name: "張簡沐訓", chapter: "金暘分會", company: "璞石數位文化出版", title: "負責人", industry: "行銷廣告", services: "短影音拍攝、形象照", lookingFor: "醫生、保健品廠商", painPoints: "穩定的客源" },
  { name: "謝瀞儀", chapter: "金美分會", company: "福生室內裝修", title: "負責人", industry: "建築營造", services: "室內裝修、統合施工", lookingFor: "商辦建築師、代銷公司", painPoints: "專業單一工種廠商" },
  { name: "楊文玲", chapter: "金美分會", company: "睿豐財富管理", title: "資深顧問", industry: "金融保險", services: "美股、ETF、資產配置", lookingFor: "中小企業闆娘、企業輔導顧問", painPoints: "高資產客戶信任感建立" },
  { name: "湯詠煊", chapter: "金佑分會", company: "善業法律事務所", title: "主持律師", industry: "法律服務", services: "訴訟代理、企業法律顧問", lookingFor: "中小企業老闆", painPoints: "案源不穩定" },
  { name: "王瑜", chapter: "長城分會", company: "南山人壽", title: "業務主任", industry: "金融保險", services: "雇主責任險", lookingFor: "員工兩人以上餐飲服務業", painPoints: "協助雇主解決職災補償問題" },
  { name: "劉冠良", chapter: "長翼分會", company: "兆豐證券", title: "業務襄理", industry: "金融保險", services: "結構債、投資標的", lookingFor: "50歲以上企業主", painPoints: "尋找長期穩定金融夥伴" },
  { name: "張騏凱", chapter: "長沛分會", company: "班克先生", title: "業務經理", industry: "金融保險", services: "財商教育、銀行貸款", lookingFor: "房貸減壓屋主、銀行放款業務", painPoints: "業務繁雜量能不足" },
  { name: "游振南", chapter: "長沛分會", company: "Doku獨庫數位", title: "網頁設計師", industry: "行銷廣告", services: "網站架設、整合行銷", lookingFor: "房地產、醫療設備、教育單位、醫美", painPoints: "B2B客戶來源不穩定" },
  { name: "黃佑翔", chapter: "台中市中心區百萬分會", company: "PU Prime 外匯券商", title: "業務經理", industry: "金融保險", services: "外匯、資產配置", lookingFor: "金融通路", painPoints: "需要更多合作通路" },
  { name: "林妙姿", chapter: "金佑分會", company: "蕙宇國際", title: "負責人", industry: "零售製造", services: "台灣檜木精油", lookingFor: "遊艇俱樂部、豪車業務、理財專員", painPoints: "尋找高端客戶" },
  { name: "蘇濬澤", chapter: "前大陽分會", company: "預健國際", title: "業務", industry: "健康醫療", services: "醫療設備經紀", lookingFor: "大健康、亞健康產業", painPoints: "民眾健康意識不足" },
  { name: "李若僑", chapter: "金佑分會", company: "創亦行銷有限公司", title: "商務開發總監", industry: "行銷廣告", services: "網站設計、企業專屬網站規劃", lookingFor: "服務中小企業的品牌顧問、廣告投放公司", painPoints: "尋找精準策略聯盟" },
];
