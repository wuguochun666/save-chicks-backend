// 拯救小鸡 v2.1 - 故事内容 (30关，每3关救一只小鸡，共10只)
// 每3关救一只小鸡: level 3,6,9,12,15,18,21,24,27,30
// 关卡类型: 'reading'=阅读理解, 'grammar'=语法学习

const STORIES = [
  // ===== 第1-3关 → 救第1只小鸡 (小黄) =====
  { level:1, type:'reading', title:'The Hen and Her Chicks', titleCN:'母鸡和小鸡', difficulty:'⭐',
    text:'<p>Mother Hen has five chicks. They are yellow and small.</p><p>The chicks like to play in the garden every day.</p><p>"Stay close to me!" says Mother Hen.</p><p>The chicks are happy and safe.</p>',
    vocabulary:[{word:'hen',meaning:'母鸡'},{word:'chick',meaning:'小鸡'},{word:'yellow',meaning:'黄色的'},{word:'garden',meaning:'花园'},{word:'safe',meaning:'安全的'}],
    questions:[
      {q:'How many chicks does Mother Hen have?',options:['Three','Four','Five','Six'],answer:2},
      {q:'What color are the chicks?',type:'choice',options:['Red','Blue','Yellow','Green'],answer:2},
      {q:'The chicks like to play in the ___ every day.',type:'fill',answer:'garden',explanation:'题目说"小鸡们每天喜欢在花园里玩耍"，garden 是花园的意思。'},
      {q:'Mother Hen tells the chicks to stay close to her.',type:'truefalse',answer:true,explanation:'母鸡说的是"Stay close to me!"，意思是"靠近我！"这是正确的描述。'},
      {q:'What does Mother Hen say?',options:['Run away!','Stay close!','Go home!','Be quiet!'],answer:1},
      {q:'How do the chicks feel?',type:'choice',options:['Sad and scared','Happy and safe','Tired and hungry','Lost and alone'],answer:1}
    ]
  ,
    grammarTips:[{title:'复数加 -s',content:'chick → chicks，大多数名词加 -s 变复数'},{title:'主语+动词',content:'The chicks play. 英语句式：主语 + 动词 + 其他'}]},
  { level:2, type:'grammar', title:'Grammar: is and are', titleCN:'语法：is 和 are', difficulty:'⭐',
    text:'<p><b>📚 语法：is 和 are</b></p><p>• 单数用 is：The chick <b>is</b> yellow.</p><p>• 复数用 are：The chicks <b>are</b> yellow.</p><p>• I 用 am：I <b>am</b> a hero.</p><p>• He/She/It 用 is：She <b>is</b> happy.</p><p>• We/You/They 用 are：They <b>are</b> safe.</p>',
    vocabulary:[{word:'is',meaning:'是（单数）'},{word:'are',meaning:'是（复数）'},{word:'am',meaning:'是（I用）'},{word:'singular',meaning:'单数'},{word:'plural',meaning:'复数'}],
    questions:[
      {q:'The chick ___ yellow.',options:['am','is','are','be'],answer:1},
      {q:'The chicks ___ happy.',options:['am','is','are','be'],answer:2},
      {q:'I ___ a hero.',options:['am','is','are','be'],answer:0},
      {q:'She ___ Mother Hen.',options:['am','is','are','be'],answer:1},
      {q:'We ___ friends.',options:['am','is','are','be'],answer:2}
    ]
  ,
    grammarTips:[{title:'is / are / am',content:'I 用 am，he/she/it 用 is，we/you/they 用 are'},{title:'单复数一致性',content:'The chick is / The chicks are — 主语单复数决定 be 动词'}]},
  { level:3, type:'reading', title:'The Hero Appears', titleCN:'英雄出现', difficulty:'⭐',
    text:'<p>A brave hero hears Mother Hen crying.</p><p>"Don\'t worry! I will save your chicks!" says the hero.</p><p>The hero must answer English questions to fight the eagle.</p><p>Every correct answer makes the hero stronger!</p>',
    vocabulary:[{word:'brave',meaning:'勇敢的'},{word:'worry',meaning:'担心'},{word:'save',meaning:'拯救'},{word:'correct',meaning:'正确的'},{word:'strong',meaning:'强壮的'}],
    questions:[
      {q:'Who hears Mother Hen?',options:['A farmer','A brave hero','A dog','A cat'],answer:1},
      {q:'What does the hero promise?',options:['To run away','To save the chicks','To find food','To build a nest'],answer:1},
      {q:'How does the hero fight the eagle?',options:['With a sword','By running','By answering questions','By singing'],answer:2},
      {q:'What makes the hero stronger?',options:['Food','Sleep','Correct answers','Money'],answer:2},
      {q:'How does the hero feel?',options:['Scared','Brave','Tired','Sad'],answer:1}
    ]
  ,
    grammarTips:[{title:'will 表将来',content:'I will save = 我将要拯救。will + 动词原形表将来'},{title:'must 表必须',content:'The hero must answer = 英雄必须回答'}]},

  // ===== 第4-6关 → 救第2只小鸡 (小白) =====
  { level:4, type:'reading', title:'The Eagle Comes', titleCN:'老鹰来了', difficulty:'⭐⭐',
    text:'<p>One day, a big shadow falls on the garden.</p><p>It is a large eagle! The eagle has sharp claws.</p><p>It flies down fast and grabs the chicks!</p><p>Mother Hen cries, "Help! Help! My babies!"</p>',
    vocabulary:[{word:'shadow',meaning:'影子'},{word:'sharp',meaning:'锋利的'},{word:'claw',meaning:'爪子'},{word:'grab',meaning:'抓住'},{word:'cry',meaning:'哭喊'}],
    questions:[
      {q:'What falls on the garden first?',options:['Rain','A shadow','Leaves','Snow'],answer:1},
      {q:'What does the eagle have?',options:['Soft feathers','Sharp claws','Long tail','Big eyes'],answer:1},
      {q:'How does the eagle fly down?',options:['Slowly','Quietly','Fast','Carefully'],answer:2},
      {q:'What does the eagle do to the chicks?',options:['Feeds them','Grabs them','Plays with them','Ignores them'],answer:1},
      {q:'What does Mother Hen call the chicks?',options:['Friends','Students','Babies','Strangers'],answer:2}
    ]
  ,
    grammarTips:[{title:'一般现在时',content:'A shadow falls. 描述习惯或事实用一般现在时'},{title:'感叹句',content:'Help! = 感叹词，表示紧急求救'}]},
  { level:5, type:'grammar', title:'Grammar: a and an', titleCN:'语法：a 和 an', difficulty:'⭐⭐',
    text:'<p><b>📚 语法：a 和 an</b></p><p>• 辅音开头的单词前用 a：a chick, a hen, a worm</p><p>• 元音(a,e,i,o,u)开头的单词前用 an：an eagle, an apple, an egg</p><p>• 记忆口诀：元音前用 an，辅音前用 a</p><p>• 例句：I see a hen and an eagle.</p>',
    vocabulary:[{word:'a',meaning:'一个（辅音前）'},{word:'an',meaning:'一个（元音前）'},{word:'vowel',meaning:'元音'},{word:'eagle',meaning:'老鹰'},{word:'egg',meaning:'蛋'}],
    questions:[
      {q:'___ eagle is flying.',options:['A','An','The','Some'],answer:1},
      {q:'I have ___ chick.',options:['a','an','the','some'],answer:0},
      {q:'She found ___ egg.',options:['a','an','the','some'],answer:1},
      {q:'He is ___ hero.',options:['a','an','the','some'],answer:0},
      {q:'There is ___ apple on the tree.',options:['a','an','the','some'],answer:1}
    ]
  ,
    grammarTips:[{title:'现在进行时',content:'is + doing → The eagle is flying. 表示正在发生'},{title:'方位介词',content:'in the garden / on the wall / under the tree'}]},
  { level:6, type:'reading', title:'First Chick Rescued!', titleCN:'小黄获救！', difficulty:'⭐⭐',
    text:'<p>The hero answers three questions correctly. The eagle is surprised!</p><p>"Here is your first chick!" says the eagle slowly.</p><p>The little chick runs to Mother Hen with joy.</p><p>"Thank you, hero! Nine more chicks to go!" cries Mother Hen.</p>',
    vocabulary:[{word:'promise',meaning:'承诺'},{word:'slowly',meaning:'慢慢地'},{word:'joy',meaning:'喜悦'},{word:'rescue',meaning:'救援'},{word:'surprised',meaning:'惊讶的'}],
    questions:[
      {q:'How many questions did the hero answer correctly?',options:['One','Two','Three','Four'],answer:2},
      {q:'How does the eagle feel?',options:['Happy','Angry','Surprised','Scared'],answer:2},
      {q:'How does the chick run to Mother Hen?',options:['Sadly','Slowly','With joy','With fear'],answer:2},
      {q:'How many more chicks are left?',options:['Seven','Eight','Nine','Ten'],answer:2},
      {q:'What does Mother Hen call the hero?',options:['Enemy','Stranger','Hero','Friend'],answer:2}
    ]
  ,
    grammarTips:[{title:'can 表能力',content:'I can help! = 我能帮忙！can + 动词原形'},{title:'祈使句',content:'Come here! 祈使句省略主语 you，直接动词开头'}]},

  // ===== 第7-9关 → 救第3只小鸡 (小花) =====
  { level:7, type:'reading', title:'The First Battle', titleCN:'第一场战斗', difficulty:'⭐⭐',
    text:'<p>The hero climbs the mountain to find the eagle\'s nest.</p><p>The path is long and difficult, but the hero does not stop.</p><p>"I must be strong for the chicks," the hero thinks.</p><p>At last, the hero sees the eagle waiting at the top.</p>',
    vocabulary:[{word:'climb',meaning:'攀爬'},{word:'mountain',meaning:'山'},{word:'path',meaning:'小路'},{word:'difficult',meaning:'困难的'},{word:'nest',meaning:'巢'}],
    questions:[
      {q:'Where does the hero go?',options:['To the river','To the mountain','To the forest','To the city'],answer:1},
      {q:'How is the path?',options:['Short and easy','Long and difficult','Wide and flat','Dark and cold'],answer:1},
      {q:'Does the hero stop?',options:['Yes, many times','No, not at all','Yes, once','Yes, twice'],answer:1},
      {q:'What does the hero think about?',options:['Food','Sleep','Being strong for the chicks','Going home'],answer:2},
      {q:'Where is the eagle?',options:['At the bottom','In the middle','At the top','In the sky'],answer:2}
    ]
  ,
    grammarTips:[{title:'一般过去时',content:'The hero walked. 过去发生的事，动词加 -ed'},{title:'不规则过去式',content:'go → went, come → came, see → saw'}]},
  { level:8, type:'grammar', title:'Grammar: Present Simple Tense', titleCN:'语法：一般现在时', difficulty:'⭐⭐',
    text:'<p><b>📚 语法：一般现在时</b></p><p>• 表示习惯或经常发生的动作</p><p>• 第三人称单数(he/she/it)动词加 -s 或 -es</p><p>• The hero climbs the mountain. (他/她/它 → 加s)</p><p>• The chicks play every day. (其他 → 不加s)</p><p>• 否定：He does not stop. / They do not stop.</p>',
    vocabulary:[{word:'climb',meaning:'攀爬'},{word:'play',meaning:'玩耍'},{word:'does not',meaning:'不（第三人称单数否定）'},{word:'do not',meaning:'不（其他否定）'},{word:'every day',meaning:'每天'}],
    questions:[
      {q:'The hero ___ the mountain every day.',options:['climb','climbs','climbing','climbed'],answer:1},
      {q:'The chicks ___ in the garden.',options:['plays','play','playing','played'],answer:1},
      {q:'She ___ not stop.',options:['do','does','did','is'],answer:1},
      {q:'They ___ not give up.',options:['do','does','did','is'],answer:0},
      {q:'The eagle ___ at the top.',options:['wait','waits','waiting','waited'],answer:1}
    ]
  ,
    grammarTips:[{title:'There is / are',content:'There is a tree / There are flowers. 单数is 复数are'},{title:'介词短语',content:'in the forest / behind the rock / next to the river'}]},
  { level:9, type:'reading', title:'Second Chick Rescued!', titleCN:'小花获救！', difficulty:'⭐⭐',
    text:'<p>Six levels done! The eagle releases the second chick.</p><p>The chick chirps happily and flies to Mother Hen.</p><p>Mother Hen hugs both chicks with her wings.</p><p>"Wonderful! Eight more to go! You are amazing!" she calls out.</p>',
    vocabulary:[{word:'release',meaning:'释放'},{word:'chirp',meaning:'啾啾叫'},{word:'hug',meaning:'拥抱'},{word:'wing',meaning:'翅膀'},{word:'amazing',meaning:'令人惊叹的'}],
    questions:[
      {q:'How many levels are done?',options:['Three','Six','Nine','Twelve'],answer:1},
      {q:'How does the second chick feel?',options:['Sad','Scared','Happily','Angry'],answer:2},
      {q:'What does Mother Hen use to hug the chicks?',options:['Her claws','Her beak','Her wings','Her tail'],answer:2},
      {q:'How many chicks are still with the eagle?',options:['Six','Seven','Eight','Nine'],answer:2},
      {q:'What does Mother Hen say?',options:['Give up','You are amazing','Come back','Be careful'],answer:1}
    ]
  ,
    grammarTips:[{title:'形容词比较级',content:'braver = 更勇敢。单音节形容词 + er'},{title:'than 比较句型',content:'The hero is braver than the eagle. A is ...er than B'}]},

  // ===== 第10-12关 → 救第4只小鸡 (小黑) =====
  { level:10, type:'grammar', title:'Grammar: Question Words', titleCN:'语法：疑问词', difficulty:'⭐⭐⭐',
    text:'<p><b>📚 语法：疑问词</b></p><p>• What 什么：What is this?</p><p>• Who 谁：Who is the hero?</p><p>• Where 哪里：Where are the chicks?</p><p>• When 什么时候：When did the eagle come?</p><p>• Why 为什么：Why is the hen sad?</p><p>• How 怎么：How many chicks are there?</p>',
    vocabulary:[{word:'what',meaning:'什么'},{word:'who',meaning:'谁'},{word:'where',meaning:'哪里'},{word:'when',meaning:'什么时候'},{word:'why',meaning:'为什么'}],
    questions:[
      {q:'___ is the hero? (asking about a person)',options:['What','Who','Where','When'],answer:1},
      {q:'___ are the chicks? (asking about location)',options:['What','Who','Where','Why'],answer:2},
      {q:'___ is the eagle angry? (asking for reason)',options:['What','Who','Where','Why'],answer:3},
      {q:'___ did the eagle come? (asking about time)',options:['What','When','Where','Why'],answer:1},
      {q:'___ many chicks are there?',options:['What','Who','How','Why'],answer:2}
    ]
  ,
    grammarTips:[{title:'问句结构',content:'Where does the chick hide? 疑问词 + does + 主语 + 动词'},{title:'does / do',content:'第三人称单数用 does，其他人称用 do'}]},
  { level:11, type:'reading', title:'The Dark Forest', titleCN:'黑暗森林', difficulty:'⭐⭐⭐',
    text:'<p>The hero entered a dark forest to reach the eagle\'s new hiding place.</p><p>Strange sounds echoed through the trees, but the hero stayed calm.</p><p>"Fear is just a feeling. Knowledge gives me courage," the hero thought.</p><p>The hero pressed forward, guided by the sound of the chicks.</p>',
    vocabulary:[{word:'enter',meaning:'进入'},{word:'echo',meaning:'回响'},{word:'calm',meaning:'冷静的'},{word:'courage',meaning:'勇气'},{word:'press forward',meaning:'继续前进'}],
    questions:[
      {q:'Where did the hero go?',options:['A bright field','A dark forest','A tall mountain','A deep river'],answer:1},
      {q:'What echoed through the trees?',options:['Music','Strange sounds','The hero\'s voice','Rain'],answer:1},
      {q:'How did the hero stay?',options:['Scared','Angry','Calm','Confused'],answer:2},
      {q:'What gives the hero courage?',options:['Money','Food','Knowledge','Friends'],answer:2},
      {q:'What guided the hero?',options:['A map','The sun','The sound of the chicks','A compass'],answer:2}
    ]
  ,
    grammarTips:[{title:'频率副词',content:'always > usually > often > sometimes > never'},{title:'副词位置',content:'频率副词放在 be 后，实义动词前：is always / always runs'}]},
  { level:12, type:'reading', title:'Third Chick Rescued!', titleCN:'小黑获救！', difficulty:'⭐⭐⭐',
    text:'<p>Nine levels done! The eagle releases the third chick.</p><p>The chick leaps from the cage and runs as fast as it can.</p><p>Mother Hen spreads her wings wide to welcome her baby home.</p><p>"Three more! You are incredible, hero!" Mother Hen shouts with tears of joy.</p>',
    vocabulary:[{word:'reluctantly',meaning:'不情愿地'},{word:'leap',meaning:'跳跃'},{word:'spread',meaning:'展开'},{word:'incredible',meaning:'不可思议的'},{word:'tears of joy',meaning:'喜悦的泪水'}],
    questions:[
      {q:'How many levels are completed?',options:['Six','Nine','Twelve','Fifteen'],answer:1},
      {q:'How does the eagle release the chick?',options:['Happily','Quickly','Reluctantly','Loudly'],answer:2},
      {q:'What does the chick do?',options:['Hides','Sleeps','Leaps and runs','Cries'],answer:2},
      {q:'What does Mother Hen do?',options:['Runs away','Spreads her wings wide','Cries alone','Fights the eagle'],answer:1},
      {q:'How many chicks are still with the eagle?',options:['Five','Six','Seven','Eight'],answer:2}
    ]
  ,
    grammarTips:[{title:'可数/不可数',content:'apple 可数→apples; water 不可数→不能加 -s'},{title:'量词搭配',content:'a piece of bread / a cup of water / a bottle of milk'}]},

  // ===== 第13-15关 → 救第5只小鸡 (小金) =====
  { level:13, type:'reading', title:'The Journey Continues', titleCN:'旅程继续', difficulty:'⭐⭐⭐',
    text:'<p>Six chicks are still with the eagle. The hero must continue.</p><p>The eagle makes the next challenges harder and harder.</p><p>"I have learned so much already," the hero says confidently.</p><p>"Nothing can stop me from saving all the chicks!"</p>',
    vocabulary:[{word:'continue',meaning:'继续'},{word:'confidently',meaning:'自信地'},{word:'already',meaning:'已经'},{word:'nothing',meaning:'没有什么'},{word:'challenge',meaning:'挑战'}],
    questions:[
      {q:'How many chicks are still with the eagle?',options:['Five','Six','Seven','Eight'],answer:1},
      {q:'What does the eagle do to the next challenges?',options:['Makes them easier','Makes them harder','Removes them','Ignores them'],answer:1},
      {q:'How does the hero speak?',options:['Sadly','Angrily','Confidently','Quietly'],answer:2},
      {q:'What does the hero say about stopping?',options:['I might stop','Nothing can stop me','I will stop soon','Please stop me'],answer:1},
      {q:'What has the hero done already?',options:['Given up','Learned so much','Gone home','Made friends'],answer:1}
    ]
  ,
    grammarTips:[{title:'一般将来时',content:'will + 动词原形 = I will find the way'},{title:'be going to',content:'am/is/are going to + 动词原形，表示计划或打算'}]},
  { level:14, type:'grammar', title:'Grammar: Past Simple Tense', titleCN:'语法：一般过去时', difficulty:'⭐⭐⭐',
    text:'<p><b>📚 语法：一般过去时</b></p><p>• 表示过去发生的动作，动词加 -ed</p><p>• The hero climbed the mountain. (climb→climbed)</p><p>• 不规则动词：go→went, come→came, see→saw</p><p>• 否定：He did not stop. (did not + 原形)</p><p>• 疑问：Did the hero win? (Did + 主语 + 原形)</p>',
    vocabulary:[{word:'climbed',meaning:'攀爬了（过去式）'},{word:'went',meaning:'去了（go的过去式）'},{word:'came',meaning:'来了（come的过去式）'},{word:'saw',meaning:'看见了（see的过去式）'},{word:'did not',meaning:'没有（过去否定）'}],
    questions:[
      {q:'The hero ___ the mountain yesterday.',options:['climb','climbs','climbed','climbing'],answer:2},
      {q:'The eagle ___ to the garden last week.',options:['come','comes','came','coming'],answer:2},
      {q:'She ___ not stop.',options:['do','does','did','is'],answer:2},
      {q:'___ the hero win? (question form)',options:['Do','Does','Did','Is'],answer:2},
      {q:'I ___ the chick in the nest.',options:['see','sees','saw','seeing'],answer:2}
    ]
  ,
    grammarTips:[{title:'情态动词',content:'should 应该 / must 必须 / can 可以。后接动词原形'},{title:'否定形式',content:'shouldn\'t = should not, mustn\'t = must not, can\'t = cannot'}]},
  { level:15, type:'reading', title:'Fourth Chick Rescued!', titleCN:'小金获救！', difficulty:'⭐⭐⭐',
    text:'<p>Twelve levels completed! The eagle releases the fourth chick.</p><p>Mother Hen holds all four babies close together.</p><p>"Halfway there! Six more to go! I knew you could do it!" she cheers.</p><p>The hero smiles. "We are almost there!"</p>',
    vocabulary:[{word:'halfway',meaning:'一半路程'},{word:'cheer',meaning:'欢呼'},{word:'close',meaning:'靠近'},{word:'together',meaning:'一起'},{word:'almost',meaning:'几乎'}],
    questions:[
      {q:'How many chicks are rescued now?',options:['Two','Three','Four','Five'],answer:2},
      {q:'How many are still with the eagle?',options:['Four','Five','Six','Seven'],answer:2},
      {q:'What does Mother Hen do?',options:['Runs away','Holds babies close','Fights the eagle','Sleeps'],answer:1},
      {q:'How does Mother Hen feel?',options:['Worried','Cheerful and hopeful','Scared','Angry'],answer:1},
      {q:'What does the hero say?',options:['We are done','We are almost there','I give up','Go home'],answer:1}
    ]
  ,
    grammarTips:[{title:'现在完成时',content:'have/has + 过去分词。I have found the chick!'},{title:'just/already/yet',content:'just 刚刚 / already 已经 / yet 还没（用于完成时）'}]},

  // ===== 第16-18关 → 救第6只小鸡 (小小) =====
  { level:16, type:'reading', title:'The Rainy Day', titleCN:'下雨天', difficulty:'⭐⭐⭐⭐',
    text:'<p>It rained heavily that day. The hero got wet but kept going.</p><p>The eagle laughed, "Give up! The rain will stop you!"</p><p>But the hero remembered the crying chicks and Mother Hen.</p><p>"A little rain cannot stop a true hero!" the hero shouted.</p>',
    vocabulary:[{word:'heavily',meaning:'大量地'},{word:'wet',meaning:'湿的'},{word:'laugh',meaning:'嘲笑'},{word:'remember',meaning:'记住'},{word:'shout',meaning:'大喊'}],
    questions:[
      {q:'What was the weather like?',options:['Sunny','Snowy','Rainy','Windy'],answer:2},
      {q:'What happened to the hero?',options:['Got cold','Got wet','Got lost','Got tired'],answer:1},
      {q:'What did the eagle say?',options:['Well done!','Give up!','Keep going!','I am sorry!'],answer:1},
      {q:'What did the hero remember?',options:['The food','The crying chicks and Mother Hen','The sunny day','The eagle\'s words'],answer:1},
      {q:'What did the hero shout?',options:['I give up!','Help me!','A little rain cannot stop a true hero!','I am scared!'],answer:2}
    ]
  ,
    grammarTips:[{title:'宾格代词',content:'I→me, he→him, she→her, we→us, they→them'},{title:'动词后用宾格',content:'Give me the key. = 把钥匙给我。'}]},
  { level:17, type:'grammar', title:'Grammar: Adjectives', titleCN:'语法：形容词', difficulty:'⭐⭐⭐⭐',
    text:'<p><b>📚 语法：形容词</b></p><p>• 形容词用来描述名词，放在名词前面</p><p>• a brave hero（勇敢的英雄）</p><p>• a sharp claw（锋利的爪子）</p><p>• 比较级：加 -er 或用 more</p><p>• brave → braver（更勇敢）</p><p>• difficult → more difficult（更困难）</p>',
    vocabulary:[{word:'brave',meaning:'勇敢的'},{word:'braver',meaning:'更勇敢的'},{word:'sharp',meaning:'锋利的'},{word:'difficult',meaning:'困难的'},{word:'more difficult',meaning:'更困难的'}],
    questions:[
      {q:'The hero is ___ than the eagle. (brave)',options:['brave','braver','most brave','bravest'],answer:1},
      {q:'Level 5 is ___ than level 1. (difficult)',options:['difficult','difficulter','more difficult','most difficult'],answer:2},
      {q:'Which is correct?',options:['a hero brave','brave a hero','a brave hero','hero brave a'],answer:2},
      {q:'The eagle has ___ claws.',options:['sharply','sharp','sharper','sharpness'],answer:1},
      {q:'The chicks are ___ than before. (safe)',options:['safe','safer','more safe','safest'],answer:1}
    ]
  ,
    grammarTips:[{title:'祈使句否定',content:'Don\'t run! = 不要跑！Don\'t + 动词原形'},{title:'Let 引导句',content:'Let me help you. = 让我帮你。Let + 宾格 + 动词原形'}]},
  { level:18, type:'reading', title:'Fifth Chick Rescued!', titleCN:'小小获救！', difficulty:'⭐⭐⭐⭐',
    text:'<p>Fifteen levels! The eagle releases the fifth chick reluctantly.</p><p>"You are truly a master of English!" the eagle admits.</p><p>"Only three more to go. But I will make it harder!"</p><p>The hero grins. "I am ready for anything you throw at me!"</p>',
    vocabulary:[{word:'master',meaning:'大师'},{word:'admit',meaning:'承认'},{word:'reluctantly',meaning:'不情愿地'},{word:'grin',meaning:'咧嘴笑'},{word:'throw at',meaning:'向...扔'}],
    questions:[
      {q:'How many levels are done?',options:['Twelve','Fifteen','Eighteen','Twenty'],answer:1},
      {q:'What does the eagle call the hero?',options:['A student','A master of English','A fool','A beginner'],answer:1},
      {q:'How many chicks are left?',options:['Three','Four','Five','Six'],answer:1},
      {q:'How does the eagle feel?',options:['Happy','Reluctant but impressed','Angry','Scared'],answer:1},
      {q:'How does the hero react?',options:['Worried','Scared','Grins confidently','Quiet'],answer:2}
    ]
  ,
    grammarTips:[{title:'反身代词',content:'myself / yourself / himself / herself / ourselves / themselves'},{title:'强调自己',content:'The hero did it himself. = 英雄自己做的'}]},

  // ===== 第19-21关 → 救第7只小鸡 (小棕) =====
  { level:19, type:'reading', title:'The Eagle\'s Trick', titleCN:'老鹰的诡计', difficulty:'⭐⭐⭐⭐',
    text:'<p>The eagle tried to trick the hero with confusing questions.</p><p>"You will never understand English grammar!" the eagle sneered.</p><p>But the hero had studied hard and recognized every trick.</p><p>"Your tricks don\'t work on someone who truly understands!" the hero replied.</p>',
    vocabulary:[{word:'trick',meaning:'诡计'},{word:'confusing',meaning:'令人困惑的'},{word:'sneer',meaning:'嘲讽'},{word:'recognize',meaning:'识别'},{word:'truly',meaning:'真正地'}],
    questions:[
      {q:'What did the eagle try to do?',options:['Help the hero','Trick the hero','Teach the hero','Ignore the hero'],answer:1},
      {q:'What kind of questions did the eagle use?',options:['Easy ones','Confusing ones','Simple ones','Fun ones'],answer:1},
      {q:'What did the eagle say about the hero?',options:['You are smart','You will never understand','You are brave','You will win'],answer:1},
      {q:'Why did the hero recognize every trick?',options:['Because of luck','Because of studying hard','Because of the eagle\'s help','Because of magic'],answer:1},
      {q:'What did the hero say?',options:['I give up','Your tricks don\'t work on someone who truly understands','I am scared','Help me'],answer:1}
    ]
  ,
    grammarTips:[{title:'过去进行时',content:'was/were + doing. The chick was hiding.'},{title:'when 连接',content:'The eagle came when the chicks were playing. 当……时'}]},
  { level:20, type:'grammar', title:'Grammar: Future Tense will', titleCN:'语法：将来时 will', difficulty:'⭐⭐⭐⭐',
    text:'<p><b>📚 语法：将来时 will</b></p><p>• 表示将来要做的事情，用 will + 动词原形</p><p>• I will save the chicks.（我将要救小鸡）</p><p>• She will not give up.（她不会放弃）</p><p>• Will you help me?（你会帮我吗？）</p><p>• 缩写：will not = won\'t</p>',
    vocabulary:[{word:'will',meaning:'将要'},{word:'will not',meaning:'将不会'},{word:"won't",meaning:"will not缩写"},{word:'future',meaning:'将来'},{word:'promise',meaning:'承诺'}],
    questions:[
      {q:'I ___ save all the chicks!',options:['save','saves','will save','saved'],answer:2},
      {q:'She ___ not give up.',options:['do','does','will','did'],answer:2},
      {q:'___ you help me? (question)',options:['Do','Does','Will','Did'],answer:2},
      {q:'The eagle ___ not win.',options:['do','does','will','did'],answer:2},
      {q:'Which is correct?',options:['I will saves','I will save','I wills save','I will saving'],answer:1}
    ]
  ,
    grammarTips:[{title:'条件句 if',content:'If it rains, we will stay home. if + 现在时, will + 动词'},{title:'真实条件句',content:'表示可能发生的情况，主句用将来时'}]},
  { level:21, type:'reading', title:'Sixth Chick Rescued!', titleCN:'小棕获救！', difficulty:'⭐⭐⭐⭐',
    text:'<p>Eighteen levels! The eagle must keep its promise again.</p><p>"Here is your sixth chick!" The hero\'s heart leaps with joy.</p><p>Mother Hen now has six babies safe and warm.</p><p>"Only four more! You are unstoppable!"</p>',
    vocabulary:[{word:'unstoppable',meaning:'无法阻挡的'},{word:'leap',meaning:'跳跃'},{word:'warm',meaning:'温暖的'},{word:'promise',meaning:'承诺'},{word:'safe',meaning:'安全的'}],
    questions:[
      {q:'How many chicks does Mother Hen have now?',options:['Five','Six','Seven','Eight'],answer:1},
      {q:'How does the hero feel?',options:['Sad','Tired','Heart leaps with joy','Worried'],answer:2},
      {q:'How many more chicks are left?',options:['Two','Three','Four','Five'],answer:2},
      {q:'What does Mother Hen call the hero?',options:['A student','Unstoppable','A beginner','Lucky'],answer:1},
      {q:'How do the six babies feel?',options:['Scared and cold','Safe and warm','Lost and alone','Hungry and tired'],answer:1}
    ]
  ,
    grammarTips:[{title:'最高级',content:'the bravest = 最勇敢的。the + 形容词最高级'},{title:'one of the + 最高级',content:'He is one of the bravest heroes. 之一'}]},

  // ===== 第22-24关 → 救第8只小鸡 (小蓝) =====
  { level:22, type:'grammar', title:'Grammar: Prepositions', titleCN:'语法：介词', difficulty:'⭐⭐⭐⭐',
    text:'<p><b>📚 语法：介词</b></p><p>• in 在...里面：The chick is in the nest.</p><p>• on 在...上面：The eagle is on the mountain.</p><p>• at 在（某地点/时间）：The hero is at the top.</p><p>• to 去往：The hero goes to the forest.</p><p>• from 来自：The chick comes from the nest.</p>',
    vocabulary:[{word:'in',meaning:'在...里面'},{word:'on',meaning:'在...上面'},{word:'at',meaning:'在（某处）'},{word:'to',meaning:'去往'},{word:'from',meaning:'来自'}],
    questions:[
      {q:'The chick is ___ the nest.',options:['on','in','at','to'],answer:1},
      {q:'The eagle sits ___ the mountain.',options:['in','on','at','from'],answer:1},
      {q:'The hero arrives ___ the top.',options:['in','on','at','from'],answer:2},
      {q:'The hero goes ___ the forest.',options:['in','on','at','to'],answer:3},
      {q:'The chick comes ___ the nest.',options:['in','on','at','from'],answer:3}
    ]
  ,
    grammarTips:[{title:'间接引语',content:'He said (that) he was brave. 间接引语时态后退一步'},{title:'引语变化',content:'现在时→过去时, 过去时→过去完成时'}]},
  { level:23, type:'reading', title:'Almost There', titleCN:'快到了', difficulty:'⭐⭐⭐⭐',
    text:'<p>The hero could now see the eagle\'s final hiding place clearly.</p><p>Four chicks were visible, huddled together in a large cage.</p><p>The hero\'s heart ached seeing them so frightened.</p><p>"Hold on! I am almost there!" the hero called to the chicks.</p>',
    vocabulary:[{word:'visible',meaning:'可见的'},{word:'huddle',meaning:'挤在一起'},{word:'cage',meaning:'笼子'},{word:'ache',meaning:'疼痛'},{word:'frightened',meaning:'害怕的'}],
    questions:[
      {q:'What could the hero see?',options:['The garden','The eagle\'s final hiding place','Mother Hen','A river'],answer:1},
      {q:'How many chicks were visible?',options:['Two','Three','Four','Five'],answer:2},
      {q:'Where were the chicks?',options:['In a tree','In a large cage','On a rock','In the sky'],answer:1},
      {q:'How did the chicks look?',options:['Happy','Playful','Frightened','Sleepy'],answer:2},
      {q:'What did the hero call to the chicks?',options:['Give up!','I am lost!','Hold on! I am almost there!','Run away!'],answer:2}
    ]
  ,
    grammarTips:[{title:'不定式 to do',content:'want to help = 想要帮助。to + 动词原形作目的'},{title:'常见搭配',content:'need to / want to / like to / hope to / try to + 动词原形'}]},
  { level:24, type:'reading', title:'Seventh Chick Rescued!', titleCN:'小蓝获救！', difficulty:'⭐⭐⭐⭐',
    text:'<p>Twenty-one levels completed! The eagle reluctantly opens the cage.</p><p>The seventh chick leaps out and rushes to Mother Hen.</p><p>Mother Hen spreads her wings wide: "Three more, brave hero! Almost home!"</p><p>The hero takes a deep breath. "Three more levels. I can do this!"</p>',
    vocabulary:[{word:'rush',meaning:'冲'},{word:'breathe',meaning:'呼吸'},{word:'reluctantly',meaning:'不情愿地'},{word:'deep',meaning:'深深的'},{word:'open',meaning:'打开'}],
    questions:[
      {q:'How many levels are completed?',options:['Eighteen','Twenty-one','Twenty-four','Twenty-seven'],answer:1},
      {q:'What does the eagle do?',options:['Runs away','Opens the cage','Hides the chick','Laughs'],answer:1},
      {q:'How many more chicks are left?',options:['Two','Three','Four','Five'],answer:1},
      {q:'What does Mother Hen say?',options:['Give up','Almost home!','Go away','Stop now'],answer:1},
      {q:'What does the hero do?',options:['Gives up','Takes a deep breath and continues','Cries','Goes home'],answer:1}
    ]
  ,
    grammarTips:[{title:'动名词 doing',content:'enjoy playing = 喜欢玩。enjoy/like/stop + doing'},{title:'to do vs doing',content:'stop to do 停下来去做 / stop doing 停止做某事'}]},

  // ===== 第25-27关 → 救第9只小鸡 (小紫) =====
  { level:25, type:'reading', title:'The Final Challenge', titleCN:'最终挑战', difficulty:'⭐⭐⭐⭐⭐',
    text:'<p>Only three chicks remain. The eagle is furious and desperate.</p><p>"I will make these last challenges impossible!" the eagle roared.</p><p>The hero stood tall. "I have come too far to fail now."</p><p>"Every word I learned has prepared me for this moment."</p>',
    vocabulary:[{word:'remain',meaning:'剩余'},{word:'furious',meaning:'愤怒的'},{word:'desperate',meaning:'绝望的'},{word:'roar',meaning:'咆哮'},{word:'prepare',meaning:'准备'}],
    questions:[
      {q:'How many chicks remain with the eagle?',options:['One','Two','Three','Four'],answer:2},
      {q:'How does the eagle feel?',options:['Happy and calm','Furious and desperate','Tired and bored','Proud and strong'],answer:1},
      {q:'What does the eagle say about the challenges?',options:['They will be easy','They will be impossible','They will be fun','They will be short'],answer:1},
      {q:'What does the hero say?',options:['I give up','I have come too far to fail','I am scared','I need help'],answer:1},
      {q:'What has prepared the hero?',options:['Money','Food','Every word learned','Magic'],answer:2}
    ]
  ,
    grammarTips:[{title:'被动语态',content:'The chick was saved by the hero. = 小鸡被英雄救了'},{title:'被动结构',content:'be + 过去分词. The letter was written in English.'}]},
  { level:26, type:'grammar', title:'Grammar: Present Perfect', titleCN:'语法：现在完成时', difficulty:'⭐⭐⭐⭐⭐',
    text:'<p><b>📚 语法：现在完成时</b></p><p>• 表示过去发生、对现在有影响的动作</p><p>• 结构：have/has + 过去分词</p><p>• I have learned many words.（我已经学了很多词）</p><p>• She has saved seven chicks.（她已经救了七只小鸡）</p><p>• 常用词：already（已经）, yet（还没）, just（刚刚）</p>',
    vocabulary:[{word:'have learned',meaning:'已经学了'},{word:'has saved',meaning:'已经救了'},{word:'already',meaning:'已经'},{word:'yet',meaning:'还没'},{word:'just',meaning:'刚刚'}],
    questions:[
      {q:'I ___ already learned 200 words.',options:['learn','learned','have learned','will learn'],answer:2},
      {q:'She ___ saved seven chicks.',options:['save','saved','has saved','will save'],answer:2},
      {q:'Have you ___ the eagle? (ever)',options:['see','sees','seen','seeing'],answer:2},
      {q:'The hero has not finished ___. (yet)',options:['already','yet','just','ever'],answer:1},
      {q:'Which is correct?',options:['I have went','I have go','I have gone','I have going'],answer:2}
    ]
  ,
    grammarTips:[{title:'定语从句',content:'The hero who saved the chick is brave. who 指人'},{title:'which / that',content:'which 指物，that 指人或物：The plan that worked well'}]},
  { level:27, type:'reading', title:'Eighth Chick Rescued!', titleCN:'小紫获救！', difficulty:'⭐⭐⭐⭐⭐',
    text:'<p>Twenty-four levels! The eagle releases the eighth chick with a heavy sigh.</p><p>"You are truly the greatest hero I have ever met," the eagle says quietly.</p><p>"Two more. Can you do it?" Mother Hen asks hopefully.</p><p>"Two more? Challenge accepted!" the hero declares.</p>',
    vocabulary:[{word:'heavy sigh',meaning:'沉重的叹息'},{word:'quietly',meaning:'轻声地'},{word:'greatest',meaning:'最伟大的'},{word:'hopefully',meaning:'满怀希望地'},{word:'declare',meaning:'宣布'}],
    questions:[
      {q:'How many chicks does Mother Hen have now?',options:['Six','Seven','Eight','Nine'],answer:2},
      {q:'What does the eagle say about the hero?',options:['A good student','The greatest hero ever met','An average learner','A lucky person'],answer:1},
      {q:'How does the eagle release the chick?',options:['Quickly','With a heavy sigh','Happily','Silently'],answer:1},
      {q:'How does Mother Hen ask?',options:['Angrily','Hopefully','Skeptically','Worried'],answer:1},
      {q:'What does the hero declare?',options:['I quit','Challenge accepted!','I need rest','Go home now'],answer:1}
    ]
  ,
    grammarTips:[{title:'完成进行时',content:'have/has been + doing. I have been waiting for 3 hours.'},{title:'vs 完成时',content:'完成进行时强调持续过程，完成时强调结果'}]},

  // ===== 第28-30关 → 救第10只小鸡 (小彩) =====
  { level:28, type:'grammar', title:'Grammar: Conjunctions', titleCN:'语法：连词', difficulty:'⭐⭐⭐⭐⭐',
    text:'<p><b>📚 语法：连词</b></p><p>• and 和：The hero is brave and smart.</p><p>• but 但是：It rained, but the hero kept going.</p><p>• or 或者：Win or lose, the hero tried.</p><p>• because 因为：The hen cried because she was sad.</p><p>• so 所以：The hero studied hard, so she won.</p>',
    vocabulary:[{word:'and',meaning:'和'},{word:'but',meaning:'但是'},{word:'or',meaning:'或者'},{word:'because',meaning:'因为'},{word:'so',meaning:'所以'}],
    questions:[
      {q:'The hero is brave ___ smart.',options:['but','and','or','so'],answer:1},
      {q:'It rained, ___ the hero kept going.',options:['and','but','or','because'],answer:1},
      {q:'The hen cried ___ she was sad.',options:['and','but','or','because'],answer:3},
      {q:'The hero studied hard, ___ she won.',options:['but','or','so','because'],answer:2},
      {q:'Win ___ lose, the hero tried.',options:['and','but','or','so'],answer:2}
    ]
  ,
    grammarTips:[{title:'虚拟语气',content:'If I were a bird, I would fly. 与事实相反的假设'},{title:'were 型虚拟',content:'虚拟条件句中 be 动词统一用 were'}]},
  { level:29, type:'reading', title:'The Eagle Surrenders', titleCN:'老鹰投降', difficulty:'⭐⭐⭐⭐⭐',
    text:'<p>The hero answered every single question correctly without hesitation.</p><p>The eagle was completely speechless. It had never been defeated before.</p><p>"You have truly mastered the English language," the eagle admitted.</p><p>"I will release all remaining chicks. You have earned it, hero."</p>',
    vocabulary:[{word:'hesitation',meaning:'犹豫'},{word:'completely',meaning:'完全地'},{word:'speechless',meaning:'无言以对'},{word:'master',meaning:'掌握'},{word:'earn',meaning:'赢得'}],
    questions:[
      {q:'How did the hero answer the questions?',options:['Some correctly','None correctly','Every single one correctly','Most correctly'],answer:2},
      {q:'How did the eagle feel?',options:['Happy','Speechless','Angry','Excited'],answer:1},
      {q:'Had the eagle been defeated before?',options:['Yes, many times','Yes, once','Never','Sometimes'],answer:2},
      {q:'What did the eagle admit?',options:['The hero is weak','The hero has mastered English','The hero is lucky','The hero cheated'],answer:1},
      {q:'What will the eagle do?',options:['Keep the chicks','Release all remaining chicks','Fly away','Fight more'],answer:1}
    ]
  ,
    grammarTips:[{title:'状语从句',content:'Although it is hard, we never give up. 让步状语从句'},{title:'常见连词',content:'although 虽然 / because 因为 / until 直到 / unless 除非'}]},
  { level:30, type:'reading', title:'All Chicks Saved!', titleCN:'全部小鸡获救！', difficulty:'⭐⭐⭐⭐⭐',
    text:'<p>All ten chicks are finally free! They rush to Mother Hen in a joyful crowd.</p><p>Mother Hen holds all her babies close, tears streaming down her face.</p><p>"You did it! You saved my whole family!" she cries with overflowing happiness.</p><p>The hero smiles. "Learning English saved the day. Never stop learning!"</p>',
    vocabulary:[{word:'finally',meaning:'终于'},{word:'rush',meaning:'冲向'},{word:'stream',meaning:'流淌'},{word:'whole',meaning:'全部的'},{word:'overflowing',meaning:'溢出的'}],
    questions:[
      {q:'How many chicks are finally free?',options:['Eight','Nine','Ten','Eleven'],answer:2},
      {q:'What does Mother Hen do?',options:['Runs away','Holds all her babies close','Fights the eagle','Sleeps'],answer:1},
      {q:'What streams down Mother Hen\'s face?',options:['Rain','Sweat','Tears','Water'],answer:2},
      {q:'What saved the day according to the hero?',options:['Strength','Money','Learning English','Magic'],answer:2},
      {q:'What is the hero\'s final message?',options:['Rest now','Never stop learning','Go home','Forget English'],answer:1}
    ]
  ,
    grammarTips:[{title:'时态综合',content:'英语12种时态：一般/进行/完成/完成进行 × 过去/现在/将来'},{title:'语境判断时态',content:'看时间标志词：yesterday→过去时, now→进行时, already→完成时'}]}
];

// 小鸡数据（共10只，每3关救一只）
const CHICKS = [
  { id:1, name:'小黄', emoji:'🐤', color:'#FFD54F', rescueLevel:3,  action:'走来走去' },
  { id:2, name:'小白', emoji:'🐤', color:'#E8E8E8', rescueLevel:6,  action:'吃小米' },
  { id:3, name:'小花', emoji:'🐤', color:'#FF8A65', rescueLevel:9,  action:'开心玩耍' },
  { id:4, name:'小黑', emoji:'🐤', color:'#607D8B', rescueLevel:12, action:'晒太阳' },
  { id:5, name:'小金', emoji:'🐤', color:'#FFD700', rescueLevel:15, action:'睡觉觉' },
  { id:6, name:'小小', emoji:'🐤', color:'#80DEEA', rescueLevel:18, action:'唱歌' },
  { id:7, name:'小棕', emoji:'🐤', color:'#A1887F', rescueLevel:21, action:'跳舞' },
  { id:8, name:'小蓝', emoji:'🐤', color:'#90CAF9', rescueLevel:24, action:'看风景' },
  { id:9, name:'小紫', emoji:'🐤', color:'#CE93D8', rescueLevel:27, action:'做运动' },
  { id:10,name:'小彩', emoji:'🐤', color:'#F48FB1', rescueLevel:30, action:'荡秋千' }
,
  // === v76 task-009: 入门难度文章 ===

  // ===== v76 Task-009: Easy articles (入门) =====
  {
    id: 100, title: 'A Day at School',
    difficulty: 'easy',
    topics: ['life', 'school'],
    text: 'Tom goes to school every morning. He wakes up at seven o\'clock. He brushes his teeth and eats breakfast. Then he walks to school with his friends. At school, he learns math, English, and science. After lunch, he plays soccer on the playground. School ends at three o\'clock. Tom walks home and does his homework before dinner.',
    article: 'Tom goes to school every morning. He wakes up at seven o\'clock. He brushes his teeth and eats breakfast. Then he walks to school with his friends. At school, he learns math, English, and science. After lunch, he plays soccer on the playground. School ends at three o\'clock. Tom walks home and does his homework before dinner.',
    vocabulary: [
      {word:'morning',meaning:'早晨'},
      {word:'breakfast',meaning:'早餐'},
      {word:'playground',meaning:'操场'},
      {word:'homework',meaning:'作业'}
    ],
    grammarTips: [
      {title:'一般现在时',content:'描述日常习惯性动作，如"He wakes up at seven o\'clock."'}
    ],
    questions: [
      {q:'What time does Tom wake up?', type:'choice', options:['Six o\'clock','Seven o\'clock','Eight o\'clock','Nine o\'clock'], answer:1, explanation:'文中说 "He wakes up at seven o\'clock."'},
      {q:'What does Tom do after school?', type:'choice', options:['Goes to bed','Does homework','Plays video games','Reads books'], answer:1, explanation:'文中说 "Tom walks home and does his homework before dinner."'},
      {q:'Tom plays soccer at lunch time.', type:'truefalse', answer:0, explanation:'文中说 "After lunch, he plays soccer on the playground." 是午餐后，不是午餐时。'},
      {q:'Tom walks to school with his ___ .', type:'fill', answer:'friends', explanation:'文中说 "he walks to school with his friends."'},
      {q:'School ends at ___ o\'clock.', type:'fill', answer:'three', explanation:'文中说 "School ends at three o\'clock."'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 101, title: 'My Favorite Pet',
    difficulty: 'easy',
    topics: ['life', 'animals'],
    text: 'I have a pet dog named Lucky. Lucky is brown and white. He has big ears and a long tail. Every day, I take Lucky for a walk in the park. He loves to run and play with other dogs. At home, Lucky sleeps in a small bed near my room. He is my best friend. When I am sad, Lucky always makes me happy. I love my pet very much.',
    article: 'I have a pet dog named Lucky. Lucky is brown and white. He has big ears and a long tail. Every day, I take Lucky for a walk in the park. He loves to run and play with other dogs. At home, Lucky sleeps in a small bed near my room. He is my best friend. When I am sad, Lucky always makes me happy. I love my pet very much.',
    vocabulary: [
      {word:'pet',meaning:'宠物'},
      {word:'brown',meaning:'棕色的'},
      {word:'park',meaning:'公园'},
      {word:'bed',meaning:'床'}
    ],
    grammarTips: [
      {title:'现在进行时',content:'描述正在发生的动作，如 "Lucky is sleeping."'}
    ],
    questions: [
      {q:'What is the dog\'s name?', type:'choice', options:['Max','Lucky','Brown','Happy'], answer:1, explanation:'文中说 "I have a pet dog named Lucky."'},
      {q:'Where does Lucky sleep?', type:'choice', options:['In the garden','In a small bed','On the sofa','In the kitchen'], answer:1, explanation:'文中说 "Lucky sleeps in a small bed near my room."'},
      {q:'Lucky is brown and white.', type:'truefalse', answer:1, explanation:'文中说 "Lucky is brown and white." 是正确的。'},
      {q:'Where does the writer take Lucky every day?', type:'fill', answer:'park', explanation:'文中说 "I take Lucky for a walk in the park."'},
      {q:'Lucky is my best ___ .', type:'fill', answer:'friend', explanation:'文中说 "He is my best friend."'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 102, title: 'The Weather Today',
    difficulty: 'easy',
    topics: ['nature', 'life'],
    text: 'Today is a sunny day. The sky is blue and there are no clouds. It is warm outside. Many people are in the park. Children are playing games. Some people are having a picnic. Others are riding bikes. The weather is nice for outdoor activities. I think today is a perfect day for a trip to the beach.',
    article: 'Today is a sunny day. The sky is blue and there are no clouds. It is warm outside. Many people are in the park. Children are playing games. Some people are having a picnic. Others are riding bikes. The weather is nice for outdoor activities. I think today is a perfect day for a trip to the beach.',
    vocabulary: [
      {word:'sunny',meaning:'阳光明媚的'},
      {word:'cloud',meaning:'云'},
      {word:'picnic',meaning:'野餐'},
      {word:'beach',meaning:'海滩'}
    ],
    grammarTips: [
      {title:'There be 句型',content:'描述某处有某物，如 "There are no clouds."'}
    ],
    questions: [
      {q:'What is the weather like today?', type:'choice', options:['Rainy','Cloudy','Sunny','Snowy'], answer:2, explanation:'文中说 "Today is a sunny day."'},
      {q:'What are children doing?', type:'choice', options:['Reading books','Playing games','Sleeping','Cooking'], answer:1, explanation:'文中说 "Children are playing games."'},
      {q:'Some people are riding bikes.', type:'truefalse', answer:1, explanation:'文中说 "Others are riding bikes." 是正确的。'},
      {q:'The sky is ___ and there are no clouds.', type:'fill', answer:'blue', explanation:'文中说 "The sky is blue and there are no clouds."'},
      {q:'The writer thinks today is a perfect day for a ___ .', type:'fill', answer:'beach', explanation:'文中说 "a perfect day for a trip to the beach."'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 103, title: 'My Family',
    difficulty: 'easy',
    topics: ['life', 'family'],
    text: 'There are four people in my family. My father is a doctor. He works in a hospital. My mother is a teacher. She teaches math in a primary school. I have a brother. His name is Jack. He is twelve years old. We all live in a big house. Every Sunday, we have dinner together. I love my family very much.',
    article: 'There are four people in my family. My father is a doctor. He works in a hospital. My mother is a teacher. She teaches math in a primary school. I have a brother. His name is Jack. He is twelve years old. We all live in a big house. Every Sunday, we have dinner together. I love my family very much.',
    vocabulary: [
      {word:'family',meaning:'家庭'},
      {word:'doctor',meaning:'医生'},
      {word:'teacher',meaning:'老师'},
      {word:'brother',meaning:'兄弟'}
    ],
    grammarTips: [
      {title:'一般现在时',content:'描述职业和家庭成员，如 "My mother is a teacher."'}
    ],
    questions: [
      {q:'What does my father do?', type:'choice', options:['He is a teacher','He is a doctor','He is a driver','He is a chef'], answer:1, explanation:'文中说 "My father is a doctor."'},
      {q:'What does my mother teach?', type:'choice', options:['English','Science','Math','History'], answer:2, explanation:'文中说 "She teaches math in a primary school."'},
      {q:'There are four people in the family.', type:'truefalse', answer:1, explanation:'文中说 "There are four people in my family." 是正确的。'},
      {q:'My mother works in a ___ .', type:'fill', answer:'primary school', explanation:'文中说 "She teaches math in a primary school."'},
      {q:'Jack is my ___ .', type:'fill', answer:'brother', explanation:'文中说 "I have a brother. His name is Jack."'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 104, title: 'Healthy Food',
    difficulty: 'easy',
    topics: ['life', 'health'],
    text: 'Eating healthy food is important for our body. Every day, I eat lots of vegetables and fruits. For breakfast, I usually have milk and eggs. For lunch, I eat rice and chicken. I also drink a lot of water. I never drink soda. Good food gives me energy to study and play. My mother cooks delicious food for us every day.',
    article: 'Eating healthy food is important for our body. Every day, I eat lots of vegetables and fruits. For breakfast, I usually have milk and eggs. For lunch, I eat rice and chicken. I also drink a lot of water. I never drink soda. Good food gives me energy to study and play. My mother cooks delicious food for us every day.',
    vocabulary: [
      {word:'vegetables',meaning:'蔬菜'},
      {word:'fruits',meaning:'水果'},
      {word:'energy',meaning:'能量'},
      {word:'delicious',meaning:'美味的'}
    ],
    grammarTips: [
      {title:'频率副词',content:'描述动作频率，如 "I never drink soda."'}
    ],
    questions: [
      {q:'What do I eat every day?', type:'choice', options:['Junk food','Vegetables and fruits','Candy','Hamburgers'], answer:1, explanation:'文中说 "Every day, I eat lots of vegetables and fruits."'},
      {q:'What do I have for breakfast?', type:'choice', options:['Rice and chicken','Bread and butter','Milk and eggs','Salad and soup'], answer:2, explanation:'文中说 "For breakfast, I usually have milk and eggs."'},
      {q:'I drink a lot of soda every day.', type:'truefalse', answer:0, explanation:'文中说 "I never drink soda." 从不喝汽水。'},
      {q:'Good food gives me ___ to study and play.', type:'fill', answer:'energy', explanation:'文中说 "Good food gives me energy to study and play."'},
      {q:'For ___ , I eat rice and chicken.', type:'fill', answer:'lunch', explanation:'文中说 "For lunch, I eat rice and chicken."'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 105, title: 'My School Bag',
    difficulty: 'easy',
    topics: ['life', 'school'],
    text: 'I have a blue school bag. It has many pockets. In the big pocket, I keep my books and notebooks. In the small pocket, I put my pencils and erasers. I also carry a water bottle in the side pocket. Every morning, I pack my bag carefully. I always check if I have everything I need. A good bag helps me stay organized at school.',
    article: 'I have a blue school bag. It has many pockets. In the big pocket, I keep my books and notebooks. In the small pocket, I put my pencils and erasers. I also carry a water bottle in the side pocket. Every morning, I pack my bag carefully. I always check if I have everything I need. A good bag helps me stay organized at school.',
    vocabulary: [
      {word:'pocket',meaning:'口袋'},
      {word:'notebook',meaning:'笔记本'},
      {word:'eraser',meaning:'橡皮擦'},
      {word:'organized',meaning:'有条理的'}
    ],
    grammarTips: [
      {title:'介词 in/on/at',content:'描述物品位置，如 "I keep my books in the big pocket."'}
    ],
    questions: [
      {q:'What color is my school bag?', type:'choice', options:['Red','Green','Blue','Yellow'], answer:2, explanation:'文中说 "I have a blue school bag."'},
      {q:'Where do I keep my books?', type:'choice', options:['In the small pocket','In the big pocket','In the water bottle','On the desk'], answer:1, explanation:'文中说 "In the big pocket, I keep my books and notebooks."'},
      {q:'I keep pencils in the small pocket.', type:'truefalse', answer:1, explanation:'文中说 "In the small pocket, I put my pencils and erasers." 是正确的。'},
      {q:'Every ___ , I pack my bag carefully.', type:'fill', answer:'morning', explanation:'文中说 "Every morning, I pack my bag carefully."'},
      {q:'A good bag helps me stay ___ at school.', type:'fill', answer:'organized', explanation:'文中说 "A good bag helps me stay organized at school."'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 106, title: 'A Rainy Day',
    difficulty: 'easy',
    topics: ['nature', 'life'],
    text: 'Yesterday was a rainy day. It rained all morning. The sky was gray and dark. I stayed at home and read a book. I also watched some interesting movies. In the afternoon, the rain stopped. I went outside and played in the puddles with my friends. We had so much fun even though it was rainy.',
    article: 'Yesterday was a rainy day. It rained all morning. The sky was gray and dark. I stayed at home and read a book. I also watched some interesting movies. In the afternoon, the rain stopped. I went outside and played in the puddles with my friends. We had so much fun even though it was rainy.',
    vocabulary: [
      {word:'rainy',meaning:'下雨的'},
      {word:'puddle',meaning:'水坑'},
      {word:'gray',meaning:'灰色的'},
      {word:'fun',meaning:'乐趣'}
    ],
    grammarTips: [
      {title:'一般过去时',content:'描述过去发生的动作，如 "It rained all morning."'}
    ],
    questions: [
      {q:'What was the weather like yesterday?', type:'choice', options:['Sunny','Snowy','Rainy','Windy'], answer:2, explanation:'文中说 "Yesterday was a rainy day."'},
      {q:'What did I do in the morning?', type:'choice', options:['Went to school','Played outside','Read a book','Swam in the pool'], answer:2, explanation:'文中说 "I stayed at home and read a book."'},
      {q:'The rain stopped in the afternoon.', type:'truefalse', answer:1, explanation:'文中说 "In the afternoon, the rain stopped." 是正确的。'},
      {q:'I went outside and played in the ___ with my friends.', type:'fill', answer:'puddles', explanation:'文中说 "played in the puddles with my friends."'},
      {q:'The sky was gray and ___ .', type:'fill', answer:'dark', explanation:'文中说 "The sky was gray and dark."'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 107, title: 'My Favorite Game',
    difficulty: 'easy',
    topics: ['life', 'hobby'],
    text: 'My favorite game is basketball. I play it with my classmates after school. We usually play in the school playground. Sometimes we have matches with other classes. I am the best player on my team. Basketball helps me stay fit and healthy. It also teaches me teamwork. I practice every day to become better.',
    article: 'My favorite game is basketball. I play it with my classmates after school. We usually play in the school playground. Sometimes we have matches with other classes. I am the best player on my team. Basketball helps me stay fit and healthy. It also teaches me teamwork. I practice every day to become better.',
    vocabulary: [
      {word:'basketball',meaning:'篮球'},
      {word:'classmate',meaning:'同学'},
      {word:'match',meaning:'比赛'},
      {word:'teamwork',meaning:'团队合作'}
    ],
    grammarTips: [
      {title:'一般现在时',content:'描述爱好和习惯，如 "My favorite game is basketball."'}
    ],
    questions: [
      {q:'What is my favorite game?', type:'choice', options:['Soccer','Tennis','Basketball','Swimming'], answer:2, explanation:'文中说 "My favorite game is basketball."'},
      {q:'Who do I play with?', type:'choice', options:['My brother','My father','My classmates','My neighbors'], answer:2, explanation:'文中说 "I play it with my classmates after school."'},
      {q:'Basketball helps me stay fit and healthy.', type:'truefalse', answer:1, explanation:'文中说 "Basketball helps me stay fit and healthy." 是正确的。'},
      {q:'I play basketball with my ___ after school.', type:'fill', answer:'classmates', explanation:'文中说 "I play it with my classmates after school."'},
      {q:'Sometimes we have ___ with other classes.', type:'fill', answer:'matches', explanation:'文中说 "Sometimes we have matches with other classes."'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 108, title: 'The Four Seasons',
    difficulty: 'easy',
    topics: ['nature', 'science'],
    text: 'There are four seasons in a year. In spring, flowers bloom and trees turn green. Summer is hot and sunny. Children enjoy swimming in summer. Autumn brings cool weather and colorful leaves. Farmers harvest their crops. Winter is cold and snowy. People wear warm coats and boots. Children love to make snowmen in winter.',
    article: 'There are four seasons in a year. In spring, flowers bloom and trees turn green. Summer is hot and sunny. Children enjoy swimming in summer. Autumn brings cool weather and colorful leaves. Farmers harvest their crops. Winter is cold and snowy. People wear warm coats and boots. Children love to make snowmen in winter.',
    vocabulary: [
      {word:'season',meaning:'季节'},
      {word:'bloom',meaning:'开花'},
      {word:'harvest',meaning:'收获'},
      {word:'snowman',meaning:'雪人'}
    ],
    grammarTips: [
      {title:'There be 句型',content:'描述某处有某物，如 "There are four seasons in a year."'}
    ],
    questions: [
      {q:'How many seasons are there in a year?', type:'choice', options:['Two','Three','Four','Five'], answer:2, explanation:'文中说 "There are four seasons in a year."'},
      {q:'What happens in autumn?', type:'choice', options:['Flowers bloom','Children swim','Farmers harvest crops','Trees turn green'], answer:2, explanation:'文中说 "Farmers harvest their crops." in autumn.'},
      {q:'Summer is hot and sunny.', type:'truefalse', answer:1, explanation:'文中说 "Summer is hot and sunny." 是正确的。'},
      {q:'In ___ , flowers bloom and trees turn green.', type:'fill', answer:'spring', explanation:'文中说 "In spring, flowers bloom and trees turn green."'},
      {q:'Children love to make ___ in winter.', type:'fill', answer:'snowmen', explanation:'文中说 "Children love to make snowmen in winter."'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 109, title: 'Going to the Library',
    difficulty: 'easy',
    topics: ['life', 'culture'],
    text: 'I go to the library every Saturday. The library is quiet and cool in summer. There are many books there. I like to read story books about animals and science. The librarian is very kind. She helps me find the books I need. I usually spend two hours reading. Sometimes I borrow books to read at home. Reading is my favorite hobby.',
    article: 'I go to the library every Saturday. The library is quiet and cool in summer. There are many books there. I like to read story books about animals and science. The librarian is very kind. She helps me find the books I need. I usually spend two hours reading. Sometimes I borrow books to read at home. Reading is my favorite hobby.',
    vocabulary: [
      {word:'library',meaning:'图书馆'},
      {word:'librarian',meaning:'图书管理员'},
      {word:'borrow',meaning:'借'},
      {word:'hobby',meaning:'爱好'}
    ],
    grammarTips: [
      {title:'频率副词',content:'描述习惯，如 "I go to the library every Saturday."'}
    ],
    questions: [
      {q:'When do I go to the library?', type:'choice', options:['Every day','Every Sunday','Every Saturday','Every Wednesday'], answer:2, explanation:'文中说 "I go to the library every Saturday."'},
      {q:'What kind of books do I like?', type:'choice', options:['History books','Story books','Math books','Sports books'], answer:1, explanation:'文中说 "I like to read story books about animals and science."'},
      {q:'The library is noisy.', type:'truefalse', answer:0, explanation:'文中说 "The library is quiet and cool in summer." 是安静的。'},
      {q:'Reading is my favorite ___ .', type:'fill', answer:'hobby', explanation:'文中说 "Reading is my favorite hobby."'},
      {q:'The ___ helps me find the books I need.', type:'fill', answer:'librarian', explanation:'文中说 "She helps me find the books I need." (the librarian)'}
    ],
    stars: 3, coins: 15
  },
  {
    id: 110, title: 'Time to Get Up',
    difficulty: 'easy',
    topics: ['life', 'daily routine'],
    text: 'My alarm clock rings at six every morning. I get up quickly and open the curtains. The sun is shining through the window. I wash my face and brush my teeth. Then I get dressed and eat a quick breakfast. My father drives me to school. We leave home at seven thirty. I always arrive at school on time.',
    article: 'My alarm clock rings at six every morning. I get up quickly and open the curtains. The sun is shining through the window. I wash my face and brush my teeth. Then I get dressed and eat a quick breakfast. My father drives me to school. We leave home at seven thirty. I always arrive at school on time.',
    vocabulary: [
      {word:'alarm',meaning:'闹钟'},
      {word:'curtain',meaning:'窗帘'},
      {word:'shining',meaning:'照耀'},
      {word:'arrive',meaning:'到达'}
    ],
    grammarTips: [
      {title:'现在进行时',content:'描述正在发生的动作，如 "The sun is shining."'}
    ],
    questions: [
      {q:'What time does my alarm clock ring?', type:'choice', options:['Five o\'clock','Six o\'clock','Seven o\'clock','Eight o\'clock'], answer:1, explanation:'文中说 "My alarm clock rings at six every morning."'},
      {q:'What do I do after getting up?', type:'choice', options:['Go to bed','Wash my face','Read a book','Play games'], answer:1, explanation:'文中说 "I wash my face and brush my teeth."'},
      {q:'My father walks me to school.', type:'truefalse', answer:0, explanation:'文中说 "My father drives me to school." 是开车，不是走路。'},
      {q:'We leave home at ___ .', type:'fill', answer:'seven thirty', explanation:'文中说 "We leave home at seven thirty."'},
      {q:'The sun is ___ through the window.', type:'fill', answer:'shining', explanation:'文中说 "The sun is shining through the window."'}
    ],
    stars: 3, coins: 15
  },

  // === v76 task-009: 进阶难度文章 ===

  // ===== v76 Task-009: Medium articles (进阶) =====
  {
    id: 200, title: 'The Importance of Sleep',
    difficulty: 'medium',
    topics: ['health', 'science'],
    text: 'Sleep is one of the most important things for our health. Children should sleep for about ten hours every night. When we sleep, our body repairs itself and our brain stores new information. If we do not get enough sleep, we feel tired and cannot focus at school. Going to bed at the same time every night helps build a healthy sleep routine. Reading a book before bed can make it easier to fall asleep.',
    article: 'Sleep is one of the most important things for our health. Children should sleep for about ten hours every night. When we sleep, our body repairs itself and our brain stores new information. If we do not get enough sleep, we feel tired and cannot focus at school. Going to bed at the same time every night helps build a healthy sleep routine. Reading a book before bed can make it easier to fall asleep.',
    vocabulary: [
      {word:'repair',meaning:'修复'},
      {word:'focus',meaning:'集中注意力'},
      {word:'routine',meaning:'习惯'},
      {word:'asleep',meaning:'睡着的'}
    ],
    grammarTips: [
      {title:'should 用法',content:'表示建议，如 "Children should sleep for about ten hours."'}
    ],
    questions: [
      {q:'How many hours should children sleep?', type:'choice', options:['Six hours','Eight hours','Ten hours','Twelve hours'], answer:2, explanation:'文中说 "Children should sleep for about ten hours every night."'},
      {q:'What happens when we sleep?', type:'choice', options:['Our body stops working','Our body repairs itself','Our brain forgets information','We become stronger'], answer:1, explanation:'文中说 "our body repairs itself and our brain stores new information."'},
      {q:'What happens if we do not get enough sleep?', type:'choice', options:['We feel happy','We cannot focus','We become smarter','We sleep better'], answer:1, explanation:'文中说 "we feel tired and cannot focus at school."'},
      {q:'Going to bed at the same time helps build a healthy sleep ___.', type:'fill', answer:'routine', explanation:'文中说 "Going to bed at the same time every night helps build a healthy sleep routine."'},
      {q:'Reading a book before bed can make it easier to fall ___.', type:'fill', answer:'asleep', explanation:'文中说 "Reading a book before bed can make it easier to fall asleep."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 201, title: 'Saving the Environment',
    difficulty: 'medium',
    topics: ['environment', 'science'],
    text: 'The environment is facing serious problems today. Climate change is making the world warmer. Many forests have been cut down, and pollution is getting worse. However, we can all help protect the Earth. Simple actions like turning off lights, using less plastic, and recycling can make a big difference. Planting trees is another great way to help the environment. Every small action counts, and together we can save our planet.',
    article: 'The environment is facing serious problems today. Climate change is making the world warmer. Many forests have been cut down, and pollution is getting worse. However, we can all help protect the Earth. Simple actions like turning off lights, using less plastic, and recycling can make a big difference. Planting trees is another great way to help the environment. Every small action counts, and together we can save our planet.',
    vocabulary: [
      {word:'environment',meaning:'环境'},
      {word:'climate',meaning:'气候'},
      {word:'pollution',meaning:'污染'},
      {word:'recycle',meaning:'回收利用'}
    ],
    grammarTips: [
      {title:'however 的用法',content:'表示转折，如 "However, we can all help protect the Earth."'}
    ],
    questions: [
      {q:'What is climate change making the world?', type:'choice', options:['Colder','Warmer','Drier','Wetter'], answer:1, explanation:'文中说 "Climate change is making the world warmer."'},
      {q:'What is one simple action to help the environment?', type:'choice', options:['Using more plastic','Driving more cars','Turning off lights','Buying more things'], answer:2, explanation:'文中说 "Simple actions like turning off lights" 可以帮助环境。'},
      {q:'Planting trees is a great way to help the environment.', type:'truefalse', answer:1, explanation:'文中说 "Planting trees is another great way to help the environment." 是正确的。'},
      {q:'The environment is facing serious ___ today.', type:'fill', answer:'problems', explanation:'文中说 "The environment is facing serious problems today."'},
      {q:'Every small action ___, and together we can save our planet.', type:'fill', answer:'counts', explanation:'文中说 "Every small action counts."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 202, title: 'The Internet and My Life',
    difficulty: 'medium',
    topics: ['technology', 'life'],
    text: 'The internet has changed my life in many ways. I use it to do research for school projects. I can watch educational videos and learn new skills online. Communicating with friends and family is easier through social media and messaging apps. However, spending too much time online can be harmful. It is important to balance screen time with outdoor activities. I try to use the internet wisely and responsibly.',
    article: 'The internet has changed my life in many ways. I use it to do research for school projects. I can watch educational videos and learn new skills online. Communicating with friends and family is easier through social media and messaging apps. However, spending too much time online can be harmful. It is important to balance screen time with outdoor activities. I try to use the internet wisely and responsibly.',
    vocabulary: [
      {word:'research',meaning:'研究'},
      {word:'communicate',meaning:'交流'},
      {word:'responsibly',meaning:'负责任地'},
      {word:'balance',meaning:'平衡'}
    ],
    grammarTips: [
      {title:'however 的用法',content:'表示转折，如 "However, spending too much time online can be harmful."'}
    ],
    questions: [
      {q:'What do I use the internet for?', type:'choice', options:['Only gaming','Only shopping','Research for school projects','Watching TV only'], answer:2, explanation:'文中说 "I use it to do research for school projects."'},
      {q:'Why is too much time online harmful?', type:'choice', options:['It is fun','It can be harmful','It saves money','It helps learning'], answer:1, explanation:'文中说 "spending too much time online can be harmful."'},
      {q:'What is important to balance with screen time?', type:'choice', options:['More screen time','Sleep','Outdoor activities','Homework'], answer:2, explanation:'文中说 "It is important to balance screen time with outdoor activities."'},
      {q:'The internet has changed my life in ___ ways.', type:'fill', answer:'many', explanation:'文中说 "The internet has changed my life in many ways."'},
      {q:'I try to use the internet wisely and ___.', type:'fill', answer:'responsibly', explanation:'文中说 "I try to use the internet wisely and responsibly."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 203, title: 'My Dream Job',
    difficulty: 'medium',
    topics: ['career', 'life'],
    text: 'When I grow up, I want to become a veterinarian. I love animals, and I want to help them when they are sick. To become a vet, I need to study hard in school, especially in science and math. I also need to be patient and kind. Every weekend, I volunteer at a local animal shelter. This experience teaches me how to care for different animals. Working with animals makes me very happy.',
    article: 'When I grow up, I want to become a veterinarian. I love animals, and I want to help them when they are sick. To become a vet, I need to study hard in school, especially in science and math. I also need to be patient and kind. Every weekend, I volunteer at a local animal shelter. This experience teaches me how to care for different animals. Working with animals makes me very happy.',
    vocabulary: [
      {word:'veterinarian',meaning:'兽医'},
      {word:'volunteer',meaning:'志愿者'},
      {word:'patient',meaning:'有耐心的'},
      {word:'shelter',meaning:'收容所'}
    ],
    grammarTips: [
      {title:'动词不定式',content:'表示目的，如 "I want to become a veterinarian."'}
    ],
    questions: [
      {q:'What do I want to become when I grow up?', type:'choice', options:['A teacher','A veterinarian','A pilot','A chef'], answer:1, explanation:'文中说 "I want to become a veterinarian."'},
      {q:'What subjects do I need to study hard?', type:'choice', options:['Art and music','Science and math','History and geography','English and literature'], answer:1, explanation:'文中说 "especially in science and math."'},
      {q:'Where do I volunteer every weekend?', type:'choice', options:['A hospital','A school','An animal shelter','A library'], answer:2, explanation:'文中说 "I volunteer at a local animal shelter."'},
      {q:'I love animals, and I want to help them when they are ___.', type:'fill', answer:'sick', explanation:'文中说 "I want to help them when they are sick."'},
      {q:'This experience teaches me how to ___ for different animals.', type:'fill', answer:'care', explanation:'文中说 "teaches me how to care for different animals."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 204, title: 'The Wonders of the Ocean',
    difficulty: 'medium',
    topics: ['science', 'nature'],
    text: 'The ocean covers more than seventy percent of our planet. It is home to millions of different species of plants and animals. Some fish can change their color to hide from predators. Whales travel thousands of miles every year during their migration. Coral reefs are like underwater cities, supporting thousands of marine creatures. However, many oceans are in danger because of pollution and overfishing. Protecting the ocean is essential for the health of our entire planet.',
    article: 'The ocean covers more than seventy percent of our planet. It is home to millions of different species of plants and animals. Some fish can change their color to hide from predators. Whales travel thousands of miles every year during their migration. Coral reefs are like underwater cities, supporting thousands of marine creatures. However, many oceans are in danger because of pollution and overfishing. Protecting the ocean is essential for the health of our entire planet.',
    vocabulary: [
      {word:'species',meaning:'物种'},
      {word:'predator',meaning:'捕食者'},
      {word:'migration',meaning:'迁徙'},
      {word:'essential',meaning:'必不可少的'}
    ],
    grammarTips: [
      {title:'however 的用法',content:'表示转折，如 "However, many oceans are in danger."'}
    ],
    questions: [
      {q:'How much of our planet does the ocean cover?', type:'choice', options:['About 50%','More than 70%','About 30%','Less than 20%'], answer:1, explanation:'文中说 "The ocean covers more than seventy percent of our planet."'},
      {q:'What can some fish do to hide from predators?', type:'choice', options:['Swim fast','Change their color','Grow larger','Disappear'], answer:1, explanation:'文中说 "Some fish can change their color to hide from predators."'},
      {q:'What are coral reefs compared to?', type:'choice', options:['Mountains','Deserts','Underwater cities','Forests'], answer:2, explanation:'文中说 "Coral reefs are like underwater cities."'},
      {q:'What are many oceans in danger because of?', type:'fill', answer:'pollution', explanation:'文中说 "because of pollution and overfishing."'},
      {q:'___ are like underwater cities, supporting thousands of marine creatures.', type:'fill', answer:'Coral reefs', explanation:'文中说 "Coral reefs are like underwater cities, supporting thousands of marine creatures."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 205, title: 'Healthy Habits for Students',
    difficulty: 'medium',
    topics: ['health', 'life'],
    text: 'Developing healthy habits is one of the best things students can do for themselves. Eating a balanced breakfast gives you energy for the whole morning. Regular exercise not only keeps your body strong but also improves your mood. Drinking enough water throughout the day helps keep your mind fresh. Getting enough sleep is equally important. Students who follow these habits often perform better in school and feel more confident.',
    article: 'Developing healthy habits is one of the best things students can do for themselves. Eating a balanced breakfast gives you energy for the whole morning. Regular exercise not only keeps your body strong but also improves your mood. Drinking enough water throughout the day helps keep your mind fresh. Getting enough sleep is equally important. Students who follow these habits often perform better in school and feel more confident.',
    vocabulary: [
      {word:'balanced',meaning:'均衡的'},
      {word:'exercise',meaning:'锻炼'},
      {word:'confident',meaning:'自信的'},
      {word:'perform',meaning:'表现'}
    ],
    grammarTips: [
      {title:'not only...but also',content:'表示递进，如 "keeps your body strong but also improves your mood."'}
    ],
    questions: [
      {q:'What gives energy for the whole morning?', type:'choice', options:['Eating dinner','Eating a balanced breakfast','Skipping meals','Drinking coffee'], answer:1, explanation:'文中说 "Eating a balanced breakfast gives you energy for the whole morning."'},
      {q:'What does regular exercise keep?', type:'choice', options:['Your mind busy','Your body strong','Your books clean','Your room tidy'], answer:1, explanation:'文中说 "keeps your body strong but also improves your mood."'},
      {q:'Students who follow these habits often perform ___ in school.', type:'fill', answer:'better', explanation:'文中说 "Students who follow these habits often perform better in school."'},
      {q:'Getting enough sleep is equally ___.', type:'fill', answer:'important', explanation:'文中说 "Getting enough sleep is equally important."'},
      {q:'Drinking enough water throughout the day helps keep your mind ___.', type:'fill', answer:'fresh', explanation:'文中说 "helps keep your mind fresh."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 206, title: 'My Favorite Festival',
    difficulty: 'medium',
    topics: ['culture', 'life'],
    text: 'The Spring Festival is my favorite festival in China. It usually falls in January or February. Families get together to celebrate and share a big dinner. We eat dumplings and fish. Red decorations cover the houses. We also watch the Spring Festival Gala on TV. Fireworks light up the night sky at midnight. People say goodbyes to the old year and welcome the new one. It is a time of happiness and hope.',
    article: 'The Spring Festival is my favorite festival in China. It usually falls in January or February. Families get together to celebrate and share a big dinner. We eat dumplings and fish. Red decorations cover the houses. We also watch the Spring Festival Gala on TV. Fireworks light up the night sky at midnight. People say goodbyes to the old year and welcome the new one. It is a time of happiness and hope.',
    vocabulary: [
      {word:'festival',meaning:'节日'},
      {word:'decoration',meaning:'装饰'},
      {word:'midnight',meaning:'午夜'},
      {word:'gala',meaning:'晚会'}
    ],
    grammarTips: [
      {title:'一般现在时',content:'描述传统节日活动，如 "Families get together to celebrate."'}
    ],
    questions: [
      {q:'When does the Spring Festival usually fall?', type:'choice', options:['March or April','May or June','January or February','October or November'], answer:2, explanation:'文中说 "It usually falls in January or February."'},
      {q:'What food do we eat during the Spring Festival?', type:'choice', options:['Rice and bread','Dumplings and fish','Noodles and vegetables','Pizza and hamburgers'], answer:1, explanation:'文中说 "We eat dumplings and fish."'},
      {q:'What color decorations cover the houses?', type:'choice', options:['Yellow','Green','Blue','Red'], answer:3, explanation:'文中说 "Red decorations cover the houses."'},
      {q:'Fireworks light up the night sky at ___.', type:'fill', answer:'midnight', explanation:'文中说 "Fireworks light up the night sky at midnight."'},
      {q:'People say goodbyes to the old year and ___ the new one.', type:'fill', answer:'welcome', explanation:'文中说 "welcome the new one."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 207, title: 'Space Exploration',
    difficulty: 'medium',
    topics: ['science', 'technology'],
    text: 'Space exploration has always been exciting for humans. In 1969, astronauts walked on the moon for the first time. Since then, we have sent robots to Mars to study the planet surface. The International Space Station allows scientists to live and work in space. Some companies are even planning trips to Mars for ordinary people in the future. Space technology has also helped us here on Earth with weather forecasting and communication systems.',
    article: 'Space exploration has always been exciting for humans. In 1969, astronauts walked on the moon for the first time. Since then, we have sent robots to Mars to study the planet surface. The International Space Station allows scientists to live and work in space. Some companies are even planning trips to Mars for ordinary people in the future. Space technology has also helped us here on Earth with weather forecasting and communication systems.',
    vocabulary: [
      {word:'astronaut',meaning:'宇航员'},
      {word:'robot',meaning:'机器人'},
      {word:'forecast',meaning:'预报'},
      {word:'exploration',meaning:'探索'}
    ],
    grammarTips: [
      {title:'since then',content:'表示从过去某时到现在，如 "Since then, we have sent robots to Mars."'}
    ],
    questions: [
      {q:'When did astronauts walk on the moon for the first time?', type:'choice', options:['1959','1969','1979','1989'], answer:1, explanation:'文中说 "In 1969, astronauts walked on the moon for the first time."'},
      {q:'What have we sent to Mars?', type:'choice', options:['Astronauts','Rockets','Robots','Telescopes'], answer:2, explanation:'文中说 "we have sent robots to Mars."'},
      {q:'What allows scientists to live and work in space?', type:'choice', options:['The moon','Mars','The International Space Station','The sun'], answer:2, explanation:'文中说 "The International Space Station allows scientists to live and work in space."'},
      {q:'In ___, astronauts walked on the moon for the first time.', type:'fill', answer:'1969', explanation:'文中说 "In 1969, astronauts walked on the moon."'},
      {q:'Space technology has also helped us here on Earth with weather ___ and communication systems.', type:'fill', answer:'forecasting', explanation:'文中说 "weather forecasting and communication systems."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 208, title: 'The Benefits of Reading',
    difficulty: 'medium',
    topics: ['culture', 'education'],
    text: 'Reading is one of the most beneficial habits a person can develop. It expands our vocabulary and improves our writing skills. Through books, we can travel to different places and learn about various cultures without leaving home. Reading also strengthens our memory and concentration. Research shows that people who read regularly have better analytical skills. Additionally, reading before bed can help reduce stress and improve sleep quality. Whether fiction or non-fiction, every book teaches us something valuable.',
    article: 'Reading is one of the most beneficial habits a person can develop. It expands our vocabulary and improves our writing skills. Through books, we can travel to different places and learn about various cultures without leaving home. Reading also strengthens our memory and concentration. Research shows that people who read regularly have better analytical skills. Additionally, reading before bed can help reduce stress and improve sleep quality. Whether fiction or non-fiction, every book teaches us something valuable.',
    vocabulary: [
      {word:'analytical',meaning:'分析的'},
      {word:'concentration',meaning:'专注力'},
      {word:'fiction',meaning:'小说'},
      {word:'stress',meaning:'压力'}
    ],
    grammarTips: [
      {title:'whether...or',content:'表示无论，如 "Whether fiction or non-fiction, every book teaches us something."'}
    ],
    questions: [
      {q:'What does reading expand?', type:'choice', options:['Our appetite','Our vocabulary','Our height','Our energy'], answer:1, explanation:'文中说 "It expands our vocabulary and improves our writing skills."'},
      {q:'What can we do through books?', type:'choice', options:['Make money','Travel to different places','Meet famous people','Buy things'], answer:1, explanation:'文中说 "Through books, we can travel to different places and learn about various cultures."'},
      {q:'What does reading strengthen?', type:'choice', options:['Our muscles','Our memory and concentration','Our eyesight','Our appetite'], answer:1, explanation:'文中说 "Reading also strengthens our memory and concentration."'},
      {q:'Research shows that people who read regularly have better ___ skills.', type:'fill', answer:'analytical', explanation:'文中说 "people who read regularly have better analytical skills."'},
      {q:'Reading before bed can help reduce ___ and improve sleep quality.', type:'fill', answer:'stress', explanation:'文中说 "help reduce stress and improve sleep quality."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 209, title: 'The Rise of Electric Cars',
    difficulty: 'medium',
    topics: ['technology', 'environment'],
    text: 'Electric cars are becoming more popular around the world. Unlike traditional cars that run on gasoline, electric cars are powered by batteries. They produce zero emissions, which means they do not pollute the air. This makes them much better for the environment. Electric cars are also quieter and cheaper to maintain. However, they still have some challenges. The batteries are expensive, and charging stations are not available everywhere. As technology improves, electric cars will likely become even better and more affordable.',
    article: 'Electric cars are becoming more popular around the world. Unlike traditional cars that run on gasoline, electric cars are powered by batteries. They produce zero emissions, which means they do not pollute the air. This makes them much better for the environment. Electric cars are also quieter and cheaper to maintain. However, they still have some challenges. The batteries are expensive, and charging stations are not available everywhere. As technology improves, electric cars will likely become even better and more affordable.',
    vocabulary: [
      {word:'emission',meaning:'排放'},
      {word:'gasoline',meaning:'汽油'},
      {word:'affordable',meaning:'负担得起的'},
      {word:'maintain',meaning:'维护'}
    ],
    grammarTips: [
      {title:'unlike 的用法',content:'表示对比，如 "Unlike traditional cars that run on gasoline, electric cars are powered by batteries."'}
    ],
    questions: [
      {q:'What do electric cars run on?', type:'choice', options:['Gasoline','Batteries','Solar energy','Wind power'], answer:1, explanation:'文中说 "electric cars are powered by batteries."'},
      {q:'What do electric cars produce?', type:'choice', options:['Carbon dioxide','Smoke','Zero emissions','Noise'], answer:2, explanation:'文中说 "They produce zero emissions, which means they do not pollute the air."'},
      {q:'What is still a challenge for electric cars?', type:'choice', options:['Their color','The batteries are expensive','Their speed','Their size'], answer:1, explanation:'文中说 "The batteries are expensive, and charging stations are not available everywhere."'},
      {q:'Unlike traditional cars that run on gasoline, electric cars are powered by ___ .', type:'fill', answer:'batteries', explanation:'文中说 "electric cars are powered by batteries."'},
      {q:'As technology improves, electric cars will likely become even better and more ___.', type:'fill', answer:'affordable', explanation:'文中说 "more affordable."'}
    ],
    stars: 3, coins: 20
  },
  {
    id: 210, title: 'Learning a Second Language',
    difficulty: 'medium',
    topics: ['education', 'culture'],
    text: 'Learning a second language is one of the most rewarding challenges a person can take on. It opens doors to new career opportunities and allows you to communicate with people from different backgrounds. Studies have shown that bilingual people often have better memory and problem-solving skills. However, learning a new language takes time and patience. The best approach is to practice every day, even if it is just for fifteen minutes. Watching movies, listening to music, and reading books in the new language can all help accelerate learning.',
    article: 'Learning a second language is one of the most rewarding challenges a person can take on. It opens doors to new career opportunities and allows you to communicate with people from different backgrounds. Studies have shown that bilingual people often have better memory and problem-solving skills. However, learning a new language takes time and patience. The best approach is to practice every day, even if it is just for fifteen minutes. Watching movies, listening to music, and reading books in the new language can all help accelerate learning.',
    vocabulary: [
      {word:'bilingual',meaning:'双语的'},
      {word:'opportunity',meaning:'机会'},
      {word:'accelerate',meaning:'加速'},
      {word:'rewarding',meaning:'有益的'}
    ],
    grammarTips: [
      {title:'however 的用法',content:'表示转折，如 "However, learning a new language takes time and patience."'}
    ],
    questions: [
      {q:'What does learning a second language open?', type:'choice', options:['Windows','Doors to new career opportunities','Locked rooms','Safe boxes'], answer:1, explanation:'文中说 "It opens doors to new career opportunities."'},
      {q:'What skills do bilingual people often have?', type:'choice', options:['Cooking skills','Better memory and problem-solving skills','Sports skills','Art skills'], answer:1, explanation:'文中说 "bilingual people often have better memory and problem-solving skills."'},
      {q:'What is the best approach for learning a language?', type:'choice', options:['Study once a month','Practice every day','Never read books','Avoid movies'], answer:1, explanation:'文中说 "The best approach is to practice every day."'},
      {q:'How much time should you practice even on busy days?', type:'fill', answer:'fifteen minutes', explanation:'文中说 "even if it is just for fifteen minutes."'},
      {q:'Watching movies, listening to music, and reading books can all help ___ learning.', type:'fill', answer:'accelerate', explanation:'文中说 "help accelerate learning."'}
    ],
    stars: 3, coins: 20
  },

  // === v76 task-009: 挑战难度文章 ===

  // ===== v76 Task-009: Hard articles (挑战) =====
  {
    id: 300, title: 'Artificial Intelligence in Daily Life',
    difficulty: 'hard',
    topics: ['technology', 'science'],
    text: 'Artificial intelligence, commonly known as AI, has become an integral part of our daily lives. From smart assistants like Siri and Alexa to recommendation algorithms on Netflix and YouTube, AI influences how we interact with technology. Machine learning, a subset of AI, enables computers to learn from data without being explicitly programmed. This technology powers self-driving cars, medical diagnosis systems, and language translation tools. However, the rapid advancement of AI also raises ethical concerns about privacy, job displacement, and the potential for misuse.',
    article: 'Artificial intelligence, commonly known as AI, has become an integral part of our daily lives. From smart assistants like Siri and Alexa to recommendation algorithms on Netflix and YouTube, AI influences how we interact with technology. Machine learning, a subset of AI, enables computers to learn from data without being explicitly programmed. This technology powers self-driving cars, medical diagnosis systems, and language translation tools. However, the rapid advancement of AI also raises ethical concerns about privacy, job displacement, and the potential for misuse.',
    vocabulary: [
      {word:'artificial',meaning:'人工的'},
      {word:'algorithm',meaning:'算法'},
      {word:'displacement',meaning:'取代'},
      {word:'ethical',meaning:'伦理的'}
    ],
    grammarTips: [
      {title:'非限制性定语从句',content:'用逗号隔开，如 "AI, commonly known as AI, has become..."'}
    ],
    questions: [
      {q:'What does AI stand for?', type:'choice', options:['Automatic Interface','Artificial Intelligence','Advanced Internet','Applied Information'], answer:1, explanation:'文中说 "Artificial intelligence, commonly known as AI."'},
      {q:'What enables computers to learn from data?', type:'choice', options:['Deep learning','Machine learning','Big data','Cloud computing'], answer:1, explanation:'文中说 "Machine learning, a subset of AI, enables computers to learn from data."'},
      {q:'What concerns does the rapid advancement of AI raise?', type:'choice', options:['Only positive ones','Only negative ones','Ethical concerns about privacy and job displacement','No concerns'], answer:2, explanation:'文中说 "raises ethical concerns about privacy, job displacement."'},
      {q:'AI has become an ___ part of our daily lives.', type:'fill', answer:'integral', explanation:'文中说 "has become an integral part of our daily lives."'},
      {q:'Machine learning is a ___ of AI.', type:'fill', answer:'subset', explanation:'文中说 "Machine learning, a subset of AI."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 301, title: 'Climate Change and Its Global Impact',
    difficulty: 'hard',
    topics: ['environment', 'science'],
    text: 'Climate change represents one of the most pressing challenges facing humanity today. The greenhouse effect, primarily caused by carbon dioxide and methane emissions from human activities, has led to a steady increase in global temperatures. According to scientists, the Earth\'s average temperature has risen by approximately 1.1 degrees Celsius since the pre-industrial era. This warming has resulted in melting ice caps, rising sea levels, and more frequent extreme weather events. Addressing climate change requires coordinated international efforts to reduce emissions, transition to renewable energy sources, and adapt to the inevitable changes that are already underway.',
    article: 'Climate change represents one of the most pressing challenges facing humanity today. The greenhouse effect, primarily caused by carbon dioxide and methane emissions from human activities, has led to a steady increase in global temperatures. According to scientists, the Earth\'s average temperature has risen by approximately 1.1 degrees Celsius since the pre-industrial era. This warming has resulted in melting ice caps, rising sea levels, and more frequent extreme weather events. Addressing climate change requires coordinated international efforts to reduce emissions, transition to renewable energy sources, and adapt to the inevitable changes that are already underway.',
    vocabulary: [
      {word:'greenhouse',meaning:'温室'},
      {word:'Celsius',meaning:'摄氏度'},
      {word:'inevitable',meaning:'不可避免的'},
      {word:'coordinated',meaning:'协调的'}
    ],
    grammarTips: [
      {title:'过去分词作定语',content:'如 "human activities, has led to..."'}
    ],
    questions: [
      {q:'What has caused the greenhouse effect?', type:'choice', options:['Natural disasters','Carbon dioxide and methane emissions from human activities','Solar radiation','Ocean currents'], answer:1, explanation:'文中说 "primarily caused by carbon dioxide and methane emissions from human activities."'},
      {q:'How much has the Earth\'s temperature risen since the pre-industrial era?', type:'choice', options:['0.5 degrees','1.1 degrees Celsius','2.0 degrees','0.3 degrees'], answer:1, explanation:'文中说 "risen by approximately 1.1 degrees Celsius since the pre-industrial era."'},
      {q:'What has the warming resulted in?', type:'choice', options:['Colder winters','More snow','Melting ice caps, rising sea levels, and more extreme weather','Smaller oceans'], answer:2, explanation:'文中说 "resulted in melting ice caps, rising sea levels, and more frequent extreme weather events."'},
      {q:'Climate change represents one of the most ___ challenges facing humanity today.', type:'fill', answer:'pressing', explanation:'文中说 "one of the most pressing challenges."'},
      {q:'Addressing climate change requires coordinated ___ efforts to reduce emissions.', type:'fill', answer:'international', explanation:'文中说 "requires coordinated international efforts."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 302, title: 'The Psychology of Learning',
    difficulty: 'hard',
    topics: ['psychology', 'education'],
    text: 'Understanding how the human brain learns is essential for effective education. Cognitive psychology research has revealed that the brain processes information through multiple stages: attention, encoding, storage, and retrieval. The concept of working memory, which holds information temporarily during processing, plays a crucial role in learning. Spaced repetition, a learning technique where information is reviewed at increasing intervals, has been proven to significantly improve long-term retention. Furthermore, the phenomenon known as the testing effect demonstrates that active recall practice is far more effective than passive re-reading. Educators who apply these psychological principles can design more efficient and engaging learning experiences.',
    article: 'Understanding how the human brain learns is essential for effective education. Cognitive psychology research has revealed that the brain processes information through multiple stages: attention, encoding, storage, and retrieval. The concept of working memory, which holds information temporarily during processing, plays a crucial role in learning. Spaced repetition, a learning technique where information is reviewed at increasing intervals, has been proven to significantly improve long-term retention. Furthermore, the phenomenon known as the testing effect demonstrates that active recall practice is far more effective than passive re-reading. Educators who apply these psychological principles can design more efficient and engaging learning experiences.',
    vocabulary: [
      {word:'cognitive',meaning:'认知的'},
      {word:'retention',meaning:'记忆保持'},
      {word:'retrieval',meaning:'提取'},
      {word:'phenomenon',meaning:'现象'}
    ],
    grammarTips: [
      {title:'现在分词作定语',content:'如 "the phenomenon known as the testing effect."'}
    ],
    questions: [
      {q:'What does cognitive psychology research reveal?', type:'choice', options:['That learning is impossible','That the brain processes information through multiple stages','That computers learn faster','That sleep is the best way to study'], answer:1, explanation:'文中说 "the brain processes information through multiple stages: attention, encoding, storage, and retrieval."'},
      {q:'What is the testing effect?', type:'choice', options:['Taking exams in school','Active recall practice being more effective than passive re-reading','Written tests only','Memory loss during tests'], answer:1, explanation:'文中说 "active recall practice is far more effective than passive re-reading."'},
      {q:'What is the concept of working memory?', type:'choice', options:['Permanent storage','Temporary holding of information during processing','Slow learning','Learning without sleep'], answer:1, explanation:'文中说 "holds information temporarily during processing."'},
      {q:'What plays a crucial role in learning?', type:'fill', answer:'Working memory', explanation:'文中说 "The concept of working memory... plays a crucial role in learning."'},
      {q:'Spaced repetition is a learning technique where information is reviewed at increasing ___ .', type:'fill', answer:'intervals', explanation:'文中说 "reviewed at increasing intervals."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 303, title: 'The Future of Work in the Digital Age',
    difficulty: 'hard',
    topics: ['economy', 'technology'],
    text: 'The nature of work is undergoing a profound transformation in the digital age. Automation and artificial intelligence are reshaping industries and eliminating certain job categories while creating new opportunities. The gig economy, characterized by short-term contracts and freelance work, has emerged as a significant trend. Remote work, accelerated by the COVID-19 pandemic, has become a permanent feature for many organizations. Skills that are difficult to automate, such as creativity, emotional intelligence, and complex problem-solving, are becoming increasingly valuable. To thrive in this new landscape, workers must adopt a mindset of continuous learning and adaptability.',
    article: 'The nature of work is undergoing a profound transformation in the digital age. Automation and artificial intelligence are reshaping industries and eliminating certain job categories while creating new opportunities. The gig economy, characterized by short-term contracts and freelance work, has emerged as a significant trend. Remote work, accelerated by the COVID-19 pandemic, has become a permanent feature for many organizations. Skills that are difficult to automate, such as creativity, emotional intelligence, and complex problem-solving, are becoming increasingly valuable. To thrive in this new landscape, workers must adopt a mindset of continuous learning and adaptability.',
    vocabulary: [
      {word:'automation',meaning:'自动化'},
      {word:'freelance',meaning:'自由职业'},
      {word:'adaptability',meaning:'适应能力'},
      {word:'landscape',meaning:'格局'}
    ],
    grammarTips: [
      {title:'现在分词作定语',content:'如 "characterized by short-term contracts."'}
    ],
    questions: [
      {q:'What is reshaping industries and eliminating job categories?', type:'choice', options:['Remote work','Automation and artificial intelligence','The gig economy','The pandemic'], answer:1, explanation:'文中说 "Automation and artificial intelligence are reshaping industries and eliminating certain job categories."'},
      {q:'What is the gig economy characterized by?', type:'choice', options:['Long-term employment','Short-term contracts and freelance work','Working from offices','Job security'], answer:1, explanation:'文中说 "The gig economy, characterized by short-term contracts and freelance work."'},
      {q:'What skills are difficult to automate?', type:'choice', options:['Data entry','Programming','Creativity, emotional intelligence, and complex problem-solving','Assembly line work'], answer:2, explanation:'文中说 "creativity, emotional intelligence, and complex problem-solving."'},
      {q:'To thrive in this new landscape, workers must adopt a mindset of ___ learning and ___.', type:'fill', answer:'continuous / adaptability', explanation:'文中说 "a mindset of continuous learning and adaptability."'},
      {q:'Remote work, accelerated by the COVID-19 pandemic, has become a ___ feature for many organizations.', type:'fill', answer:'permanent', explanation:'文中说 "has become a permanent feature."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 304, title: 'The Science of Nutrition',
    difficulty: 'hard',
    topics: ['health', 'science'],
    text: 'The science of nutrition is a multidisciplinary field that examines how food affects the human body. Macronutrients, including carbohydrates, proteins, and fats, provide the energy our bodies need to function. Micronutrients, such as vitamins and minerals, are essential for various metabolic processes. Recent research has revealed the significant role of gut bacteria in digestion and overall health. The concept of bioavailability explains how the body absorbs and utilizes nutrients from different food sources. Furthermore, studies have shown that dietary patterns, rather than individual nutrients, are most strongly associated with health outcomes. The Mediterranean diet, for example, has been consistently linked to reduced risk of cardiovascular disease.',
    article: 'The science of nutrition is a multidisciplinary field that examines how food affects the human body. Macronutrients, including carbohydrates, proteins, and fats, provide the energy our bodies need to function. Micronutrients, such as vitamins and minerals, are essential for various metabolic processes. Recent research has revealed the significant role of gut bacteria in digestion and overall health. The concept of bioavailability explains how the body absorbs and utilizes nutrients from different food sources. Furthermore, studies have shown that dietary patterns, rather than individual nutrients, are most strongly associated with health outcomes. The Mediterranean diet, for example, has been consistently linked to reduced risk of cardiovascular disease.',
    vocabulary: [
      {word:'multidisciplinary',meaning:'多学科的'},
      {word:'bioavailability',meaning:'生物利用率'},
      {word:'metabolic',meaning:'代谢的'},
      {word:'cardiovascular',meaning:'心血管的'}
    ],
    grammarTips: [
      {title:'现在分词作定语',content:'如 "including carbohydrates, proteins, and fats."'}
    ],
    questions: [
      {q:'What do macronutrients provide?', type:'choice', options:['Vitamins','Energy our bodies need to function','Minerals only','Only proteins'], answer:1, explanation:'文中说 "provide the energy our bodies need to function."'},
      {q:'What has recent research revealed about gut bacteria?', type:'choice', options:['They are harmful','They play a significant role in digestion and overall health','They are unrelated to health','They only exist in animals'], answer:1, explanation:'文中说 "the significant role of gut bacteria in digestion and overall health."'},
      {q:'What has been consistently linked to reduced risk of cardiovascular disease?', type:'choice', options:['The keto diet','The Mediterranean diet','The carnivore diet','Junk food'], answer:1, explanation:'文中说 "The Mediterranean diet... has been consistently linked to reduced risk of cardiovascular disease."'},
      {q:'The science of nutrition is a ___ field that examines how food affects the human body.', type:'fill', answer:'multidisciplinary', explanation:'文中说 "a multidisciplinary field."'},
      {q:'Micronutrients, such as vitamins and minerals, are essential for various ___ processes.', type:'fill', answer:'metabolic', explanation:'文中说 "essential for various metabolic processes."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 305, title: 'The History of the Internet',
    difficulty: 'hard',
    topics: ['history', 'technology'],
    text: 'The internet, which began as a military research project in the 1960s, has evolved into the most transformative communication technology in human history. The original network, known as ARPANET, was designed to allow computers at different universities to share information. The invention of the World Wide Web by Tim Berners-Lee in 1989 revolutionized how people access and share information. HTML, the language used to create web pages, enabled the rapid growth of online content. The commercialization of the internet in the 1990s led to the dot-com boom and the emergence of companies like Amazon and Google. Today, the internet connects billions of devices and has become the backbone of the global economy.',
    article: 'The internet, which began as a military research project in the 1960s, has evolved into the most transformative communication technology in human history. The original network, known as ARPANET, was designed to allow computers at different universities to share information. The invention of the World Wide Web by Tim Berners-Lee in 1989 revolutionized how people access and share information. HTML, the language used to create web pages, enabled the rapid growth of online content. The commercialization of the internet in the 1990s led to the dot-com boom and the emergence of companies like Amazon and Google. Today, the internet connects billions of devices and has become the backbone of the global economy.',
    vocabulary: [
      {word:'backbone',meaning:'支柱'},
      {word:'revolutionized',meaning:'彻底改变'},
      {word:'commercialization',meaning:'商业化'},
      {word:'ARPANET',meaning:'阿帕网'}
    ],
    grammarTips: [
      {title:'非限制性定语从句',content:'用逗号隔开，如 "The internet, which began as a military research project in the 1960s."'}
    ],
    questions: [
      {q:'When did the internet begin as a military research project?', type:'choice', options:['1940s','1950s','1960s','1970s'], answer:2, explanation:'文中说 "began as a military research project in the 1960s."'},
      {q:'Who invented the World Wide Web?', type:'choice', options:['Steve Jobs','Tim Berners-Lee','Bill Gates','Vint Cerf'], answer:1, explanation:'文中说 "The invention of the World Wide Web by Tim Berners-Lee in 1989."'},
      {q:'What enabled the rapid growth of online content?', type:'choice', options:['The internet','HTML','Mobile phones','Television'], answer:1, explanation:'文中说 "HTML... enabled the rapid growth of online content."'},
      {q:'The original network, known as ___ , was designed to allow computers at different universities to share information.', type:'fill', answer:'ARPANET', explanation:'文中说 "known as ARPANET."'},
      {q:'Today, the internet connects ___ of devices and has become the backbone of the global economy.', type:'fill', answer:'billions', explanation:'文中说 "connects billions of devices."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 306, title: 'The Philosophy of Happiness',
    difficulty: 'hard',
    topics: ['philosophy', 'psychology'],
    text: 'The pursuit of happiness has been a central theme in philosophy for thousands of years. Aristotle distinguished between momentary pleasure and the deeper satisfaction of living a virtuous life. The utilitarian philosophers, such as Jeremy Bentham and John Stuart Mill, argued that actions are right insofar as they promote happiness. Modern positive psychology, founded by Martin Seligman, identifies several factors that contribute to well-being: positive emotions, engagement, relationships, meaning, and accomplishment. Research suggests that external circumstances, such as wealth and status, have a surprisingly small impact on long-term happiness. Instead, the way we spend our time and the habits we cultivate matter far more.',
    article: 'The pursuit of happiness has been a central theme in philosophy for thousands of years. Aristotle distinguished between momentary pleasure and the deeper satisfaction of living a virtuous life. The utilitarian philosophers, such as Jeremy Bentham and John Stuart Mill, argued that actions are right insofar as they promote happiness. Modern positive psychology, founded by Martin Seligman, identifies several factors that contribute to well-being: positive emotions, engagement, relationships, meaning, and accomplishment. Research suggests that external circumstances, such as wealth and status, have a surprisingly small impact on long-term happiness. Instead, the way we spend our time and the habits we cultivate matter far more.',
    vocabulary: [
      {word:'virtuous',meaning:'有美德的'},
      {word:'utilitarian',meaning:'功利主义的'},
      {word:'well-being',meaning:'幸福感'},
      {word:'cultivate',meaning:'培养'}
    ],
    grammarTips: [
      {title:'复合定语从句',content:'如 "The way we spend our time and the habits we cultivate matter far more."'}
    ],
    questions: [
      {q:'What did Aristotle distinguish between?', type:'choice', options:['Good and bad','Momentary pleasure and the deeper satisfaction of living a virtuous life','Wealth and poverty','Knowledge and ignorance'], answer:1, explanation:'文中说 "Aristotle distinguished between momentary pleasure and the deeper satisfaction of living a virtuous life."'},
      {q:'Who founded modern positive psychology?', type:'choice', options:['Aristotle','Sigmund Freud','Martin Seligman','Carl Rogers'], answer:2, explanation:'文中说 "Modern positive psychology, founded by Martin Seligman."'},
      {q:'What factors contribute to well-being according to positive psychology?', type:'choice', options:['Only money and fame','Positive emotions, engagement, relationships, meaning, and accomplishment','Only exercise and diet','Only success and power'], answer:1, explanation:'文中说 "positive emotions, engagement, relationships, meaning, and accomplishment."'},
      {q:'External circumstances, such as wealth and status, have a surprisingly ___ impact on long-term happiness.', type:'fill', answer:'small', explanation:'文中说 "have a surprisingly small impact on long-term happiness."'},
      {q:'The utilitarian philosophers, such as Jeremy Bentham and John Stuart Mill, argued that actions are right ___ as they promote happiness.', type:'fill', answer:'insofar', explanation:'文中说 "actions are right insofar as they promote happiness."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 307, title: 'Quantum Computing Explained',
    difficulty: 'hard',
    topics: ['technology', 'science'],
    text: 'Quantum computing represents a fundamental shift in how we process information. Unlike classical computers that use bits representing 0 or 1, quantum computers use qubits that can exist in multiple states simultaneously through a property called superposition. This allows quantum computers to solve certain problems exponentially faster than classical machines. Quantum entanglement, another key phenomenon, enables qubits to be correlated in ways that have no classical equivalent. Current applications include cryptography, drug discovery, and optimization problems. However, quantum computers are extremely fragile because qubits are highly sensitive to environmental interference, a problem known as decoherence. Companies like IBM, Google, and Microsoft are racing to build practical quantum computers.',
    article: 'Quantum computing represents a fundamental shift in how we process information. Unlike classical computers that use bits representing 0 or 1, quantum computers use qubits that can exist in multiple states simultaneously through a property called superposition. This allows quantum computers to solve certain problems exponentially faster than classical machines. Quantum entanglement, another key phenomenon, enables qubits to be correlated in ways that have no classical equivalent. Current applications include cryptography, drug discovery, and optimization problems. However, quantum computers are extremely fragile because qubits are highly sensitive to environmental interference, a problem known as decoherence. Companies like IBM, Google, and Microsoft are racing to build practical quantum computers.',
    vocabulary: [
      {word:'qubit',meaning:'量子位'},
      {word:'superposition',meaning:'叠加'},
      {word:'decoherence',meaning:'退相干'},
      {word:'cryptography',meaning:'密码学'}
    ],
    grammarTips: [
      {title:'unlike 的用法',content:'表示对比，如 "Unlike classical computers that use bits."'}
    ],
    questions: [
      {q:'What do quantum computers use instead of bits?', type:'choice', options:['Bytes','Qubits','Nibbles','Digits'], answer:1, explanation:'文中说 "quantum computers use qubits."'},
      {q:'What allows qubits to exist in multiple states?', type:'choice', options:['Quantum tunneling','Superposition','Entanglement','Decoherence'], answer:1, explanation:'文中说 "can exist in multiple states simultaneously through a property called superposition."'},
      {q:'Why are quantum computers extremely fragile?', type:'choice', options:['They are expensive','Qubits are highly sensitive to environmental interference','They need a lot of electricity','They are too large'], answer:1, explanation:'文中说 "qubits are highly sensitive to environmental interference, a problem known as decoherence."'},
      {q:'Unlike classical computers that use bits representing 0 or 1, quantum computers use ___ that can exist in multiple states.', type:'fill', answer:'qubits', explanation:'文中说 "quantum computers use qubits."'},
      {q:'Current applications include cryptography, drug discovery, and ___ problems.', type:'fill', answer:'optimization', explanation:'文中说 "optimization problems."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 308, title: 'The Economics of Climate Action',
    difficulty: 'hard',
    topics: ['economy', 'environment'],
    text: 'Climate action presents both economic challenges and opportunities. The transition to a low-carbon economy requires massive investments in renewable energy, sustainable infrastructure, and green technologies. Carbon pricing mechanisms, such as carbon taxes and cap-and-trade systems, aim to internalize the external costs of greenhouse gas emissions. The concept of stranded assets refers to fossil fuel investments that may lose their value as the world shifts away from carbon-intensive energy sources. Paradoxically, climate action can stimulate economic growth through the creation of new industries and jobs. The renewable energy sector, for instance, now employs more people than the traditional fossil fuel industry in many countries.',
    article: 'Climate action presents both economic challenges and opportunities. The transition to a low-carbon economy requires massive investments in renewable energy, sustainable infrastructure, and green technologies. Carbon pricing mechanisms, such as carbon taxes and cap-and-trade systems, aim to internalize the external costs of greenhouse gas emissions. The concept of stranded assets refers to fossil fuel investments that may lose their value as the world shifts away from carbon-intensive energy sources. Paradoxically, climate action can stimulate economic growth through the creation of new industries and jobs. The renewable energy sector, for instance, now employs more people than the traditional fossil fuel industry in many countries.',
    vocabulary: [
      {word:'internalize',meaning:'内化'},
      {word:'stranded',meaning:'搁浅的'},
      {word:'paradoxically',meaning:'自相矛盾地'},
      {word:'cap-and-trade',meaning:'碳排放权交易'}
    ],
    grammarTips: [
      {title:'定语从句',content:'如 "fossil fuel investments that may lose their value."'}
    ],
    questions: [
      {q:'What do carbon pricing mechanisms aim to do?', type:'choice', options:['Increase pollution','Internalize the external costs of greenhouse gas emissions','Reduce employment','Remove renewable energy'], answer:1, explanation:'文中说 "aim to internalize the external costs of greenhouse gas emissions."'},
      {q:'What are stranded assets?', type:'choice', options:['Renewable energy investments','Fossil fuel investments that may lose their value','Green technology companies','Sustainable businesses'], answer:1, explanation:'文中说 "stranded assets refers to fossil fuel investments that may lose their value."'},
      {q:'What does the renewable energy sector employ?', type:'choice', options:['Fewer people than the fossil fuel industry','More people than the traditional fossil fuel industry','Only engineers','No one'], answer:1, explanation:'文中说 "now employs more people than the traditional fossil fuel industry."'},
      {q:'The transition to a ___ economy requires massive investments in renewable energy.', type:'fill', answer:'low-carbon', explanation:'文中说 "transition to a low-carbon economy."'},
      {q:'The concept of ___ assets refers to fossil fuel investments that may lose their value.', type:'fill', answer:'stranded', explanation:'文中说 "stranded assets refers to fossil fuel investments."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 309, title: 'The Evolution of Human Communication',
    difficulty: 'hard',
    topics: ['history', 'anthropology'],
    text: 'Human communication has undergone remarkable transformations throughout history. The earliest form of communication was likely non-verbal, relying on gestures, facial expressions, and body language. The development of spoken language, approximately 100,000 years ago, enabled more complex social interactions and the transmission of cultural knowledge. Written language emerged around 5,000 years ago in Mesopotamia and Egypt, allowing information to be preserved across time and space. The invention of the printing press by Johannes Gutenberg in the 15th century democratized knowledge by making books affordable and widely accessible. The digital revolution of the late 20th century compressed centuries of technological progress into mere decades, enabling instant global communication.',
    article: 'Human communication has undergone remarkable transformations throughout history. The earliest form of communication was likely non-verbal, relying on gestures, facial expressions, and body language. The development of spoken language, approximately 100,000 years ago, enabled more complex social interactions and the transmission of cultural knowledge. Written language emerged around 5,000 years ago in Mesopotamia and Egypt, allowing information to be preserved across time and space. The invention of the printing press by Johannes Gutenberg in the 15th century democratized knowledge by making books affordable and widely accessible. The digital revolution of the late 20th century compressed centuries of technological progress into mere decades, enabling instant global communication.',
    vocabulary: [
      {word:'democratized',meaning:'民主化'},
      {word:'transmission',meaning:'传递'},
      {word:'Mesopotamia',meaning:'美索不达米亚'},
      {word:'compressed',meaning:'压缩'}
    ],
    grammarTips: [
      {title:'现在完成时',content:'描述过去的动作对现在的影响，如 "has undergone remarkable transformations."'}
    ],
    questions: [
      {q:'What was the earliest form of communication?', type:'choice', options:['Written language','Non-verbal communication','Electronic communication','Sign language'], answer:1, explanation:'文中说 "The earliest form of communication was likely non-verbal."'},
      {q:'When did spoken language develop?', type:'choice', options:['5,000 years ago','About 100,000 years ago','50,000 years ago','1,000 years ago'], answer:1, explanation:'文中说 "The development of spoken language, approximately 100,000 years ago."'},
      {q:'Where did written language first emerge?', type:'choice', options:['China and Japan','Greece and Rome','Mesopotamia and Egypt','India and Pakistan'], answer:2, explanation:'文中说 "Written language emerged around 5,000 years ago in Mesopotamia and Egypt."'},
      {q:'When did Johannes Gutenberg invent the printing press?', type:'fill', answer:'15th century', explanation:'文中说 "in the 15th century."'},
      {q:'The digital revolution of the late 20th century compressed ___ of technological progress into mere decades.', type:'fill', answer:'centuries', explanation:'文中说 "compressed centuries of technological progress."'}
    ],
    stars: 3, coins: 25
  },
  {
    id: 310, title: 'Biotechnology and the Future of Medicine',
    difficulty: 'hard',
    topics: ['medicine', 'technology'],
    text: 'Biotechnology is revolutionizing the field of medicine in unprecedented ways. Gene editing technologies, such as CRISPR-Cas9, allow scientists to modify DNA sequences with remarkable precision, potentially curing genetic diseases. Personalized medicine, which tailors treatment to an individual\'s genetic profile, promises more effective therapies with fewer side effects. mRNA vaccines, successfully demonstrated by the COVID-19 vaccines, represent a breakthrough in vaccine development that can be rapidly adapted to new pathogens. However, these advances raise profound ethical questions about the boundaries of human enhancement and the potential for genetic inequality.',
    article: 'Biotechnology is revolutionizing the field of medicine in unprecedented ways. Gene editing technologies, such as CRISPR-Cas9, allow scientists to modify DNA sequences with remarkable precision, potentially curing genetic diseases. Personalized medicine, which tailors treatment to an individual\'s genetic profile, promises more effective therapies with fewer side effects. mRNA vaccines, successfully demonstrated by the COVID-19 vaccines, represent a breakthrough in vaccine development that can be rapidly adapted to new pathogens. However, these advances raise profound ethical questions about the boundaries of human enhancement and the potential for genetic inequality.',
    vocabulary: [
      {word:'biotechnology',meaning:'生物技术'},
      {word:'CRISPR',meaning:'基因编辑技术'},
      {word:'pathogen',meaning:'病原体'},
      {word:'inequality',meaning:'不平等'}
    ],
    grammarTips: [
      {title:'however 的用法',content:'表示转折，如 "However, these advances raise profound ethical questions."'}
    ],
    questions: [
      {q:'What allows scientists to modify DNA sequences?', type:'choice', options:['MRI machines','Gene editing technologies such as CRISPR-Cas9','X-ray machines','Ultrasound'], answer:1, explanation:'文中说 "Gene editing technologies, such as CRISPR-Cas9, allow scientists to modify DNA sequences."'},
      {q:'What does personalized medicine tailor?', type:'choice', options:['Hospital schedules','Treatment to an individual\'s genetic profile','Doctor appointments','Medical bills'], answer:1, explanation:'文中说 "tailors treatment to an individual\'s genetic profile."'},
      {q:'What do mRNA vaccines represent?', type:'choice', options:['A failure in medicine','A breakthrough in vaccine development','An old technology','An outdated approach'], answer:1, explanation:'文中说 "represent a breakthrough in vaccine development."'},
      {q:'Biotechnology is revolutionizing the field of medicine in ___ ways.', type:'fill', answer:'unprecedented', explanation:'文中说 "in unprecedented ways."'},
      {q:'Gene editing technologies, such as ___ , allow scientists to modify DNA sequences.', type:'fill', answer:'CRISPR-Cas9', explanation:'文中说 "CRISPR-Cas9."'}
    ],
    stars: 3, coins: 25
  },

];