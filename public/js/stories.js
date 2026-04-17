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
      {q:'What color are the chicks?',options:['Red','Blue','Yellow','Green'],answer:2},
      {q:'Where do the chicks play?',options:['In the house','In the garden','In the sky','In the water'],answer:1},
      {q:'What does Mother Hen say?',options:['Run away!','Stay close!','Go home!','Be quiet!'],answer:1},
      {q:'How do the chicks feel?',options:['Sad and scared','Happy and safe','Tired and hungry','Lost and alone'],answer:1}
    ]
  },
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
  },
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
  },

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
  },
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
  },
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
  },

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
  },
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
  },
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
  },

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
  },
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
  },
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
  },

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
  },
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
  },
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
  },

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
  },
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
  },
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
  },

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
  },
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
  },
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
  },

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
  },
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
  },
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
  },

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
  },
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
  },
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
  },

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
  },
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
  },
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
  }
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
];
