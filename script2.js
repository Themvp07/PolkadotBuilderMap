// DOM element references
const zoomable = document.getElementById('zoomable');           // Container for the image and interactive dots
const zoomContainer = document.getElementById('zoom-container');// Element where the scale transformation is applied
const wrapper = document.getElementById('map-wrapper');         // Main scrollable container
const image = document.getElementById('map-image');             // Map image used to calculate dot positions
const tooltip = document.getElementById('info-tooltip');        // Tooltip element that displays info on dot click
const tooltipContent = document.getElementById('tooltip-content');// Content area inside the tooltip
const closeBtn = tooltip.querySelector('.tooltip-close');       // Close button inside the tooltip

// Zoom settings
let currentScale = 1;           // Current scale level (default is 1x)
const minScale = 0.5;           // Minimum allowed zoom scale
const maxScale = 3;             // Maximum allowed zoom scale

// Array of data points representing clickable dots on the map
const dotsData = [
  // Each object represents a point with its relative position, color, radius and tooltip content.
  {
    x: 0.56, y: 0.42, colorClass: 'dot-color-blue', radius: 7,
    title: "Main protocol",
    text: {
    en: "Discover the central role of the Polkadot relay chain in securing the network and fostering interoperability. As the backbone of Polkadot, the relay chain provides shared security and ensures consensus across the ecosystem.",
    es: "Descubre el papel fundamental de la cadena relay de Polkadot para proteger la red y fomentar la interoperabilidad. Como columna vertebral de Polkadot, la cadena relay proporciona seguridad compartida y garantiza el consenso en todo el ecosistema.",
    pt: "Descubra o papel central da cadeia relay do Polkadot na segurança da rede e promoção da interoperabilidade. Como espinha dorsal do Polkadot, a cadeia relay fornece segurança compartilhada e garante consenso em todo o ecossistema.",
    fr: "Découvrez le rôle central de la chaîne relay de Polkadot dans la sécurisation du réseau et la promotion de l'interopérabilité. En tant qu'épine dorsale de Polkadot, la chaîne relay assure une sécurité partagée et garantit un consensus à travers tout l'écosystème.",
    de: "Entdecken Sie die zentrale Rolle der Polkadot-Relay-Chain bei der Sicherung des Netzwerks und Förderung der Interoperabilität. Als Rückgrat von Polkadot stellt die Relay-Chain gemeinsame Sicherheit bereit und gewährleistet Konsens im gesamten Ökosystem.",
    af: "Ontdek die sentrale rol van die Polkadot relay-ketting in die versekering van die netwerk en bevorder interverwerkbaarheid. As ruggraat van Polkadot, bied die relay-ketting gedeelde sekuriteit en verseker konsensus regoor die ekosisteem.",
    zh: "了解 Polkadot 中继链在保障网络安全和促进互操作性方面的核心作用。作为 Polkadot 的主干，中继链提供共享安全性，并确保整个生态系统达成共识。",
    hi: "पोलकाडॉट रिले चेन की नेटवर्क सुरक्षा और इंटरऑपरेबिलिटी में महत्वपूर्ण भूमिका को समझें। पोलकाडॉट की रीढ़ के रूप में, रिले चेन साझा सुरक्षा प्रदान करती है और पूरे पारिस्थितिकी तंत्र में सहमति सुनिश्चित करती है।"
  },
    source: { icon: "△", type: "TypeScript", url: "https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/", label: "polkadot.js.org" }
  },
  {
    x: 0.71, y: 0.27, colorClass: 'dot-color-blue', radius: 10,
    title: "Polkadot host",
    text: {
    en: "Polkadot host is the environment in which the runtime executes and is expected to remain stable and mostly static over the lifetime of Polkadot.",
    es: "El host de Polkadot es el entorno en el que se ejecuta el runtime y se espera que permanezca estable y mayormente estático durante la vida de Polkadot.",
    pt: "O host da Polkadot é o ambiente onde o runtime é executado e espera-se que permaneça estável e majoritariamente estático durante o tempo de vida da Polkadot.",
    fr: "L'hôte Polkadot est l'environnement dans lequel le runtime s'exécute et est censé rester stable et principalement statique pendant la durée de vie de Polkadot.",
    de: "Der Polkadot-Host ist die Umgebung, in der die Runtime ausgeführt wird und die während der Lebensdauer von Polkadot stabil und weitgehend statisch bleiben soll.",
    af: "Die Polkadot-gasheer is die omgewing waarin die runtime uitgevoer word en word verwag om stabiel en meestal staties te bly oor die leeftyd van Polkadot.",
    zh: "Polkadot主机是运行时执行的环境，预计在Polkadot的整个生命周期内保持稳定且基本静态。",
    hi: "पोल्काडॉट होस्ट वह वातावरण है जिसमें रनटाइम निष्पादित होता है और पोल्काडॉट के जीवनकाल में स्थिर और अधिकतर स्थिर रहने की अपेक्षा की जाती है।"
    },
    source: { icon: "△", type: "TBD", url: "https://wiki.polkadot.network/learn/learn-polkadot-host/", label: "polkadot.js.org" }
  },
  {
    x: 0.67, y: 0.291, colorClass: 'dot-color-blue', radius: 7,
    title: "WASM",
    text: {
    en: "WebAssembly, shortened to Wasm, is a binary instruction format for a stack-based virtual machine. Wasm is designed as a portable target for the compilation of high-level languages like C/C++/Rust, enabling deployment on the web for client and server applications.",
    es: "WebAssembly, abreviado como Wasm, es un formato de instrucción binaria para una máquina virtual basada en pila. Wasm está diseñado como un objetivo portable para la compilación de lenguajes de alto nivel como C/C++/Rust, permitiendo su implementación en la web tanto para aplicaciones cliente como servidor.",
    pt: "WebAssembly, abreviado como Wasm, é um formato de instrução binária para uma máquina virtual baseada em pilha. O Wasm é projetado como um alvo portátil para a compilação de linguagens de alto nível como C/C++/Rust, permitindo a implantação na web para aplicações clientes e servidores.",
    fr: "WebAssembly, abrégé en Wasm, est un format d'instructions binaires pour une machine virtuelle à pile. Wasm est conçu comme une cible portable pour la compilation de langages de haut niveau comme C/C++/Rust, permettant un déploiement sur le web pour les applications clientes et serveurs.",
    de: "WebAssembly, kurz Wasm, ist ein binäres Anweisungsformat für eine stapelbasierte virtuelle Maschine. Wasm wurde als portables Ziel für die Kompilierung von Hochsprachen wie C/C++/Rust entwickelt und ermöglicht die Bereitstellung im Web für Client- und Serveranwendungen.",
    af: "WebAssembly, afgekort as Wasm, is 'n binêre instruksieformaat vir 'n stapelgebaseerde virtuele masjien. Wasm is ontwerp as 'n draagbare teiken vir die samestelling van hoëvlaktale soos C/C++/Rust, wat ontplooiing op die web vir kliënt- en bedienertoepassings moontlik maak.",
    zh: "WebAssembly（缩写为Wasm）是一种基于堆栈的虚拟机的二进制指令格式。Wasm被设计为C/C++/Rust等高级语言的便携式编译目标，可在Web上部署客户端和服务器应用程序。",
    hi: "वेबएसेंबली, संक्षिप्त में वास्म (Wasm), एक स्टैक-आधारित वर्चुअल मशीन के लिए एक बाइनरी निर्देश प्रारूप है। वास्म को C/C++/रस्ट जैसी उच्च-स्तरीय भाषाओं के संकलन के लिए एक पोर्टेबल लक्ष्य के रूप में डिज़ाइन किया गया है, जो वेब पर क्लाइंट और सर्वर एप्लिकेशन्स के तैनाती को सक्षम बनाता है।"

    },
    source: { icon: "△", type: "c/c++/rust", url: "https://wiki.polkadot.network/learn/learn-wasm/", label: "polkadot.js.org" }
  },
  {
    x: 0.675, y: 0.314, colorClass: 'dot-color-blue', radius: 6,
    title: "Polkadot runtime",
    text: {
    en: "The Polkadot runtime is the core state transition logic of the chain and can be upgraded over the course of time and without the need for a hard fork. The runtime is the state transition function of the blockchain.",
    es: "El runtime de Polkadot es la lógica central de transición de estado de la cadena y puede actualizarse con el tiempo sin necesidad de un hard fork. El runtime es la función de transición de estado de la blockchain.",
    pt: "O runtime da Polkadot é a lógica central de transição de estado da cadeia e pode ser atualizado ao longo do tempo sem a necessidade de um hard fork. O runtime é a função de transição de estado da blockchain.",
    fr: "Le runtime de Polkadot est la logique centrale de transition d'état de la chaîne et peut être mis à jour au fil du temps sans avoir besoin d'un hard fork. Le runtime est la fonction de transition d'état de la blockchain.",
    de: "Die Polkadot-Runtime ist die zentrale Zustandsübergangslogik der Chain und kann im Laufe der Zeit ohne einen Hard Fork aktualisiert werden. Die Runtime ist die Zustandsübergangsfunktion der Blockchain.",
    af: "Die Polkadot-runtime is die kern-toestandsoorganglogika van die ketting en kan met verloop van tyd opgegradeer word sonder dat 'n harde fork nodig is. Die runtime is die toestandsoorgangfunksie van die blockchain.",
    zh: "Polkadot运行时（runtime）是链的核心状态转换逻辑，可随时间升级而无需硬分叉。运行时是区块链的状态转换函数。",
    hi: "पोल्काडॉट रनटाइम चेन का मुख्य स्टेट ट्रांज़िशन लॉजिक है और इसे समय के साथ बिना हार्ड फोर्क के अपग्रेड किया जा सकता है। रनटाइम ब्लॉकचेन की स्टेट ट्रांज़िशन फंक्शन है।"

    },
    source: { icon: "△", type: "TBD", url: "https://wiki.polkadot.network/learn/learn-polkadot-host/", label: "polkadot.js.org" }
  },
  {
    x: 0.68, y: 0.405, colorClass: 'dot-color-blue', radius: 6,
    title: "Concensus",
    text: {
    en: "Polkadot uses NPoS (Nominated Proof-of-Stake) as its mechanism for selecting the validator set. It is designed with the roles of validators and nominators, to maximize chain security",
    es: "Polkadot utiliza NPoS (Prueba de Participación Nominada) como mecanismo para seleccionar el conjunto de validadores. Está diseñado con los roles de validadores y nominadores para maximizar la seguridad de la cadena.",
    pt: "Polkadot utiliza NPoS (Prova de Participação Nomeada) como mecanismo para selecionar o conjunto de validadores. Foi projetado com os papéis de validadores e nominadores para maximizar a segurança da cadeia.",
    fr: "Polkadot utilise NPoS (Preuve d'Enjeu Nominée) comme mécanisme pour sélectionner l'ensemble des validateurs. Il est conçu avec les rôles de validateurs et de nominateurs pour maximiser la sécurité de la chaîne.",
    de: "Polkadot verwendet NPoS (Nominierte Proof-of-Stake) als Mechanismus zur Auswahl des Validatorsets. Es ist mit den Rollen von Validatoren und Nominatoren konzipiert, um die Chain-Sicherheit zu maximieren.",
    af: "Polkadot gebruik NPoS (Genomineerde Bewys-van-Inset) as sy meganisme om die valideerderset te kies. Dit is ontwerp met die rolle van valideerders en nominators om kettingsekuriteit te maksimeer.",
    zh: "Polkadot 使用 NPoS（提名权益证明）作为验证人集合的选举机制。该系统通过验证人和提名人的角色设计来最大化链的安全性。",
    hi: "हिन्दी: पोल्काडॉट वैलिडेटर सेट के चयन के लिए एनपीओएस (नामित प्रूफ-ऑफ-स्टेक) तंत्र का उपयोग करता है। यह चेन सुरक्षा को अधिकतम करने के लिए वैलिडेटर्स और नॉमिनेटर्स की भूमिकाओं के साथ डिज़ाइन किया गया है।"

    },
    source: { icon: "△", type: "TBD", url: "https://wiki.polkadot.network/learn/learn-consensus/", label: "polkadot.js.org" }
  },
  {
    x: 0.671, y: 0.425, colorClass: 'dot-color-blue', radius: 5,
    title: "Block production",
    text: {
    en: "The Polkadot Host uses BABE protocol for block production. It is designed based on Ouroboros Praos. BABE execution happens in sequential non-overlapping phases known as an epoch. Each epoch is divided into a predefined number of slots. All slots in each epoch are sequentially indexed starting from 0.",
    es: "Polkadot utiliza NPoS (Prueba de Participación Nominada) como mecanismo para seleccionar el conjunto de validadores. Está diseñado con los roles de validadores y nominadores para maximizar la seguridad de la cadena.",
    pt: "Polkadot utiliza NPoS (Prova de Participação Nomeada) como mecanismo para selecionar o conjunto de validadores. Foi projetado com os papéis de validadores e nominadores para maximizar a segurança da cadeia.",
    fr: "Polkadot utilise NPoS (Preuve d'Enjeu Nominée) comme mécanisme pour sélectionner l'ensemble des validateurs. Il est conçu avec les rôles de validateurs et de nominateurs pour maximiser la sécurité de la chaîne.",
    de: "Polkadot verwendet NPoS (Nominierte Proof-of-Stake) als Mechanismus zur Auswahl des Validatorsets. Es ist mit den Rollen von Validatoren und Nominatoren konzipiert, um die Chain-Sicherheit zu maximieren.",
    af: "Polkadot gebruik NPoS (Genomineerde Bewys-van-Inset) as sy meganisme om die valideerderset te kies. Dit is ontwerp met die rolle van valideerders en nominators om kettingsekuriteit te maksimeer.",
    zh: "Polkadot 使用 NPoS（提名权益证明）作为验证人集合的选举机制。该系统通过验证人和提名人的角色设计来最大化链的安全性。",
    hi: "हिन्दी: पोल्काडॉट वैलिडेटर सेट के चयन के लिए एनपीओएस (नामित प्रूफ-ऑफ-स्टेक) तंत्र का उपयोग करता है। यह चेन सुरक्षा को अधिकतम करने के लिए वैलिडेटर्स और नॉमिनेटर्स की भूमिकाओं के साथ डिज़ाइन किया गया है।"

    },
    source: { icon: "△", type: "TBD", url: "https://spec.polkadot.network/sect-block-production", label: "polkadot.js.org" }
  },
  {
    x: 0.664, y: 0.445, colorClass: 'dot-color-blue', radius: 5,
    title: "BABE",
    text: {
    en: "Blind Assignment for Blockchain Extension (BABE) is Polkadot's block production mechanism, working with GRANDPA to ensure blocks are produced consistently across the network.",
    es: "Blind Assignment for Blockchain Extension (BABE) es el mecanismo de producción de bloques de Polkadot, que trabaja junto con GRANDPA para garantizar que los bloques se produzcan de manera consistente en toda la red.",
    pt: "Blind Assignment for Blockchain Extension (BABE) é o mecanismo de produção de blocos da Polkadot, trabalhando em conjunto com GRANDPA para garantir que os blocos sejam produzidos consistentemente em toda a rede.",
    fr: "Blind Assignment for Blockchain Extension (BABE) est le mécanisme de production de blocs de Polkadot, fonctionnant avec GRANDPA pour assurer une production cohérente de blocs à travers le réseau.",
    de: "Blind Assignment for Blockchain Extension (BABE) ist Polkadots Blockproduktionsmechanismus, der mit GRANDPA zusammenarbeitet, um eine konsistente Blockproduktion im Netzwerk zu gewährleisten.",
    af: "Blind Assignment for Blockchain Extension (BABE) is Polkadot se blokproduksiemeganisme, wat saam met GRANDPA werk om te verseker dat blokke konsekwent oor die netwerk geproduseer word.",
    zh: "区块链扩展盲分配（BABE）是Polkadot的区块生产机制，与GRANDPA协议协同工作，确保整个网络中区块的一致性生产。",
    hi: "ब्लाइंड असाइनमेंट फॉर ब्लॉकचेन एक्सटेंशन (BABE) पोल्काडॉट का ब्लॉक निर्माण तंत्र है, जो GRANDPA के साथ मिलकर काम करता है ताकि पूरे नेटवर्क में ब्लॉक्स का निर्माण सुसंगत रूप से हो सके।"

    },
    source: { icon: "△", type: "TBD", url: "https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/pos-consensus/#block-production-babe ", label: "polkadot.js.org" }
  },
  {
    x: 0.708, y: 0.422, colorClass: 'dot-color-blue', radius: 5,
    title: "Finallity",
    text: {
    en: "The Polkadot Host uses GRANDPA Finality protocol to finalize blocks. Finality is obtained by consecutive rounds of voting by the validator nodes. Validators execute GRANDPA finality process in parallel to Block Production as an independent service",
    es: "El Polkadot Host utiliza el protocolo de finalidad GRANDPA para finalizar bloques. La finalidad se obtiene mediante rondas consecutivas de votación por parte de los nodos validadores. Los validadores ejecutan el proceso de finalidad GRANDPA en paralelo a la Producción de Bloques como un servicio independiente.",
    pt: "O Polkadot Host utiliza o protocolo de finalidade GRANDPA para finalizar blocos. A finalidade é obtida por meio de rodadas consecutivas de votação pelos nós validadores. Os validadores executam o processo de finalidade GRANDPA em paralelo à Produção de Blocos como um serviço independente.",
    fr: "Le Polkadot Host utilise le protocole de finalité GRANDPA pour finaliser les blocs. La finalité est obtenue par des tours de vote consécutifs des nœuds validateurs. Les validateurs exécutent le processus de finalité GRANDPA en parallèle de la Production de Blocs en tant que service indépendant.",
    de: "Der Polkadot Host verwendet das GRANDPA-Finalitätsprotokoll zur Blockfinalisierung. Die Finalität wird durch aufeinanderfolgende Abstimmungsrunden der Validator-Knoten erreicht. Validatoren führen den GRANDPA-Finalisierungsprozess parallel zur Blockproduktion als unabhängigen Dienst aus.",
    af: "Die Polkadot Host gebruik die GRANDPA-finaliteitsprotokol om blokke te finaliseer. Finaliteit word verkry deur opeenvolgende rondtes van stemming deur die valideerder nodusse. Valideerders voer die GRANDPA-finaliteitsproses parallel met Blokproduksie as 'n onafhanklike diens uit.",
    zh: "Polkadot主机使用GRANDPA最终性协议来完成区块确认。最终性通过验证节点连续多轮投票达成。验证者将GRANDPA最终性过程作为独立服务与区块生产并行执行。",
    hi: "पोल्काडॉट होस्ट ब्लॉक्स को अंतिम रूप देने के लिए GRANDPA फाइनैलिटी प्रोटोकॉल का उपयोग करता है। वैलिडेटर नोड्स के लगातार मतदान राउंड्स द्वारा फाइनैलिटी प्राप्त की जाती है। वैलिडेटर्स GRANDPA फाइनैलिटी प्रक्रिया को ब्लॉक प्रोडक्शन के समानांतर एक स्वतंत्र सेवा के रूप में निष्पादित करते हैं।"

    },
    source: { icon: "△", type: "TBD", url: "https://spec.polkadot.network/sect-finality", label: "polkadot.js.org" }
  },
  {
    x: 0.712, y: 0.44, colorClass: 'dot-color-blue', radius: 4,
    title: "GRANDPA",
    text: {
    en: "GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement) serves as the finality gadget for Polkadot's relay chain. Operating alongside the BABE block production mechanism, it ensures provable finality, giving participants confidence that blocks finalized by GRANDPA cannot be reverted.",
    es: "GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement) actúa como el mecanismo de finalidad para la cadena de retransmisión de Polkadot. Operando junto con el mecanismo de producción de bloques BABE, garantiza una finalidad demostrable, dando a los participantes la confianza de que los bloques finalizados por GRANDPA no pueden ser revertidos.",
    pt: "GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement) serve como o dispositivo de finalidade da cadeia de retransmissão da Polkadot. Operando em conjunto com o mecanismo de produção de blocos BABE, ele assegura uma finalidade comprovável, dando aos participantes a confiança de que os blocos finalizados pelo GRANDPA não podem ser revertidos.",
    fr: "GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement) sert de mécanisme de finalité pour la chaîne relais de Polkadot. Fonctionnant conjointement avec le mécanisme de production de blocs BABE, il assure une finalité prouvable, donnant aux participants la certitude que les blocs finalisés par GRANDPA ne peuvent pas être annulés.",
    de: "GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement) dient als Finalitäts-Gadget für die Relay-Chain von Polkadot. In Zusammenarbeit mit dem BABE-Blockproduktionsmechanismus gewährleistet es nachweisbare Finalität und gibt Teilnehmern die Gewissheit, dass durch GRANDPA finalisierte Blöcke nicht rückgängig gemacht werden können.",
    af: "GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement) dien as die finaliteitsmeganisme vir Polkadot se relêketting. Dit werk saam met die BABE-blokproduksiemeganisme en verseker bewysbare finaliteit, wat deelnemers die vertroue gee dat blokke wat deur GRANDPA gefinaliseer is, nie omgekeer kan word nie.",
    zh: "GRANDPA（基于GHOST的递归祖先派生前缀协议）作为Polkadot中继链的最终性工具。它与BABE区块生产机制协同工作，确保可证明的最终性，使参与者确信经GRANDPA确认的区块不可逆转。",
    hi: "GRANDPA (GHOST-आधारित पुनरावर्ती पूर्वज व्युत्पन्न उपसर्ग समझौता) पोल्काडॉट की रिले चेन के लिए फाइनैलिटी गैजेट के रूप में कार्य करता है। BABE ब्लॉक निर्माण तंत्र के साथ मिलकर काम करते हुए, यह सिद्ध करने योग्य फाइनैलिटी सुनिश्चित करता है, जिससे प्रतिभागियों को विश्वास होता है कि GRANDPA द्वारा फाइनल किए गए ब्लॉक्स को पूर्ववत नहीं किया जा सकता।"

    },
    source: { icon: "△", type: "Rust", url: "https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/pos-consensus/#finality-gadget-grandpa", label: "polkadot.js.org" }
  },
  {
    x: 0.712, y: 0.46, colorClass: 'dot-color-blue', radius: 4,
    title: "BEEFY",
    text: {
    en: "The BEEFY (Bridge Efficiency Enabling Finality Yielder) is a secondary protocol to GRANDPA to support efficient bridging between the Polkadot network (relay chain) and remote, segregated blockchains, such as Ethereum, which were not built with the Polkadot interchain operability in mind.",
    es: "BEEFY (Bridge Efficiency Enabling Finality Yielder) es un protocolo secundario de GRANDPA que permite una conexión eficiente entre la red de Polkadot (cadena de retransmisión) y cadenas de bloques remotas y segregadas, como Ethereum, que no fueron diseñadas considerando la interoperabilidad entre cadenas de Polkadot.",
    pt: "BEEFY (Bridge Efficiency Enabling Finality Yielder) é um protocolo secundário ao GRANDPA que suporta a ponte eficiente entre a rede Polkadot (cadeia de retransmissão) e blockchains remotas e segregadas, como Ethereum, que não foram construídas com a interoperabilidade entre cadeias da Polkadot em mente.",
    fr: "BEEFY (Bridge Efficiency Enabling Finality Yielder) est un protocole secondaire à GRANDPA qui permet une jonction efficace entre le réseau Polkadot (chaîne relais) et des blockchains distantes et séparées, comme Ethereum, qui n'ont pas été conçues en tenant compte de l'interopérabilité entre chaînes de Polkadot.",
    de: "BEEFY (Bridge Efficiency Enabling Finality Yielder) ist ein sekundäres Protokoll zu GRANDPA, das eine effiziente Brückenbildung zwischen dem Polkadot-Netzwerk (Relay-Chain) und entfernten, abgeschotteten Blockchains wie Ethereum ermöglicht, die nicht mit Polkadots Interchain-Interoperabilität konzipiert wurden.",
    af: "BEEFY (Bridge Efficiency Enabling Finality Yielder) is 'n sekondêre protokol na GRANDPA wat doeltreffende oorbrügging tussen die Polkadot-netwerk (aflosketting) en afgeleë, afgesonderde blockchains soos Ethereum ondersteun, wat nie gebou is met Polkadot se interketting-interoperabiliteit in gedagte nie.",
    zh: "BEEFY（桥接效率优化最终性协议）是GRANDPA的辅助协议，旨在支持Polkadot网络（中继链）与未考虑Polkadot跨链互操作性而设计的远程隔离区块链（如以太坊）之间的高效桥接。",
    hi: "BEEFY (ब्रिज एफिशिएंसी एनेबलिंग फाइनैलिटी यील्डर) GRANDPA का एक द्वितीयक प्रोटोकॉल है जो पोल्काडॉट नेटवर्क (रिले चेन) और दूरस्थ, पृथक ब्लॉकचेन जैसे एथेरियम के बीच कुशल ब्रिजिंग को सक्षम बनाता है, जिन्हें पोल्काडॉट की इंटरचेन संचालन क्षमता को ध्यान में रखकर नहीं बनाया गया था।"

    },
    source: { icon: "△", type: "TBD", url: "https://spec.polkadot.network/sect-finality#sect-grandpa-beefy", label: "polkadot.js.org" }
  },
  {
    x: 0.69, y: 0.505, colorClass: 'dot-color-blue', radius: 4,
    title: "LIBP2P",
    text: {
    en: "It is the simplest solution for global scale peer-to-peer networking and includes support for pub-sub message passing, distributed hash tables, NAT hole punching and browser-to-browser direct communication.",
    es: "Es la solución más simple para redes punto a punto a escala global e incluye soporte para mensajería pub-sub, tablas hash distribuidas, perforación NAT y comunicación directa entre navegadores.",
    pt: "É a solução mais simples para redes ponto a ponto em escala global e inclui suporte para troca de mensagens pub-sub, tabelas de hash distribuídas, NAT hole punching e comunicação direta entre navegadores.",
    fr: "C'est la solution la plus simple pour les réseaux peer-to-peer à l'échelle mondiale et comprend la prise en charge de la messagerie pub-sub, des tables de hachage distribuées, du NAT hole punching et de la communication directe entre navigateurs.",
    de: "Es ist die einfachste Lösung für Peer-to-Peer-Netzwerke im globalen Maßstab und beinhaltet Unterstützung für Pub-Sub-Nachrichtenübermittlung, verteilte Hash-Tabellen, NAT Hole Punching und direkte Browser-zu-Browser-Kommunikation.",
    af: "Dit is die eenvoudigste oplossing vir wêreldwye eweknie-netwerke en sluit ondersteuning in vir pub-sub-boodskapsturing, verspreide hashtabelle, NAT-gatboor en direkte kommunikasie tussen blaaiers.",
    zh: "这是全球规模点对点网络最简单的解决方案，包含对发布-订阅消息传递、分布式哈希表、NAT打洞以及浏览器间直接通信的支持。",
    hi: "यह वैश्विक स्तर पर पीयर-टू-पीयर नेटवर्किंग के लिए सबसे सरल समाधान है और इसमें पब-सब मैसेज पासिंग, वितरित हैश टेबल, NAT होल पंचिंग और ब्राउज़र-टू-ब्राउज़र प्रत्यक्ष संचार के लिए समर्थन शामिल है।"

    },
    source: { icon: "△", type: "Go, Rust, Js, C++", url: "https://github.com/libp2p/specs", url2: "https://docs.libp2p.io/", label: "polkadot.js.org" }
  },
  
  {
    x: 0.85, y: 0.39, colorClass: 'dot-color-blue', radius: 5,
    title: "Kagone",
    text: {
    en: "KAGOME is a Polkadot Host (former Polkadot Runtime Environment) developed by Quadrivium",
    es: "KAGOME es un Polkadot Host (anteriormente Polkadot Runtime Environment) desarrollado por Quadrivium.",
    pt: "KAGOME é um Polkadot Host (antigo Polkadot Runtime Environment) desenvolvido pela Quadrivium.",
    fr: "KAGOME est un Polkadot Host (anciennement Polkadot Runtime Environment) développé par Quadrivium.",
    de: "KAGOME ist ein Polkadot Host (ehemals Polkadot Runtime Environment), entwickelt von Quadrivium.",
    af: "KAGOME is 'n Polkadot Host (voorheen Polkadot Runtime Environment) ontwikkel deur Quadrivium.",
    zh: "KAGOME是由Quadrivium开发的Polkadot Host（前称Polkadot Runtime Environment）。",
    hi: "KAGOME एक पोल्काडॉट होस्ट (पूर्व नाम पोल्काडॉट रनटाइम एनवायरनमेंट) है जिसे क्वाड्रिवियम द्वारा विकसित किया गया है।"

    },
    source: { icon: "△", type: "C++", url: "https://github.com/qdrvm/kagome", label: "polkadot.js.org" }
  },
  {
    x: 0.85, y: 0.43, colorClass: 'dot-color-blue', radius: 5,
    title: "Gossamer",
    text: {
    en: "Gossamer is a Golang implementation of the Polkadot Host: an execution environment for the Polkadot runtime, which is materialized as a Web Assembly (Wasm) blob.",
    es: "Gossamer es una implementación en Golang del Polkadot Host: un entorno de ejecución para el runtime de Polkadot, que se materializa como un blob de Web Assembly (Wasm).",
    pt: "Gossamer é uma implementação em Golang do Polkadot Host: um ambiente de execução para o runtime da Polkadot, que é materializado como um blob de Web Assembly (Wasm).",
    fr: "Gossamer est une implémentation en Golang du Polkadot Host : un environnement d'exécution pour le runtime Polkadot, qui se matérialise sous forme de blob Web Assembly (Wasm).",
    de: "Gossamer ist eine Golang-Implementierung des Polkadot Host: eine Laufzeitumgebung für die Polkadot-Runtime, die als Web Assembly (Wasm)-Blob realisiert wird.",
    af: "Gossamer is 'n Golang-implementering van die Polkadot Host: 'n uitvoeringsomgewing vir die Polkadot-runtime, wat as 'n Web Assembly (Wasm)-blob gerealiseer word.",
    zh: "Gossamer是Polkadot Host的Golang实现：一种Polkadot运行时的执行环境，具体表现为Web Assembly (Wasm)二进制数据块。",
    hi: "गॉसमर पोल्काडॉट होस्ट का एक गोलांग कार्यान्वयन है: पोल्काडॉट रनटाइम के लिए एक निष्पादन वातावरण, जो वेब असेंबली (वास्म) ब्लॉब के रूप में साकार होता है।"

    },
    source: { icon: "△", type: "Go", url: "https://github.com/ChainSafe/gossamer", label: "polkadot.js.org" }
  },
  {
    x: 0.448, y: 0.42, colorClass: 'dot-color-red', radius: 7,
    title: "API libraries",
    text: {
    en: "powerful API libraries designed for interacting with the Polkadot network. These libraries offer developers versatile tools to build, query, and manage blockchain interactions. Whether you’re working with JavaScript, TypeScript, Python, or RESTful services, they provide the flexibility to efficiently interact with and retrieve data from Polkadot-based chains.",
    es: "potentes bibliotecas API diseñadas para interactuar con la red Polkadot. Estas bibliotecas ofrecen a los desarrolladores herramientas versátiles para construir, consultar y gestionar interacciones con la blockchain. Ya sea que estés trabajando con JavaScript, TypeScript, Python o servicios RESTful, proporcionan la flexibilidad para interactuar eficientemente y recuperar datos de cadenas basadas en Polkadot.",
    pt: "poderosas bibliotecas API projetadas para interagir com a rede Polkadot. Estas bibliotecas oferecem aos desenvolvedores ferramentas versáteis para construir, consultar e gerenciar interações com a blockchain. Seja trabalhando com JavaScript, TypeScript, Python ou serviços RESTful, elas proporcionam a flexibilidade para interagir eficientemente e recuperar dados de chains baseadas em Polkadot.",
    fr: "puissantes bibliothèques API conçues pour interagir avec le réseau Polkadot. Ces bibliothèques offrent aux développeurs des outils polyvalents pour construire, interroger et gérer les interactions blockchain. Que vous travailliez avec JavaScript, TypeScript, Python ou des services RESTful, elles fournissent la flexibilité nécessaire pour interagir efficacement et récupérer des données à partir de chaînes basées sur Polkadot.",
    de: "leistungsstarke API-Bibliotheken zur Interaktion mit dem Polkadot-Netzwerk. Diese Bibliotheken bieten Entwicklern vielseitige Tools zum Erstellen, Abfragen und Verwalten von Blockchain-Interaktionen. Egal, ob Sie mit JavaScript, TypeScript, Python oder RESTful-Diensten arbeiten - sie bieten die Flexibilität, effizient mit Polkadot-basierten Chains zu interagieren und Daten abzurufen.",
    af: "kragtige API-biblioteke wat ontwerp is om met die Polkadot-netwerk te interakteer. Hierdie biblioteke bied ontwikkelaars veelsydige gereedskap om blockchain-interaksies te bou, te bevraagteken en te bestuur. Of jy nou met JavaScript, TypeScript, Python of RESTful-dienste werk, hulle bied die buigsaamheid om doeltreffend met Polkadot-gebaseerde kettings te interakteer en data daaruit te verkry.",
    zh: "专为与Polkadot网络交互而设计的强大API库。这些库为开发人员提供了多功能工具来构建、查询和管理区块链交互。无论您使用JavaScript、TypeScript、Python还是RESTful服务，它们都能提供灵活高效的方式与基于Polkadot的链交互并检索数据。",
    hi: "पोल्काडॉट नेटवर्क के साथ इंटरैक्ट करने के लिए डिज़ाइन किए गए शक्तिशाली API लाइब्रेरीज़। ये लाइब्रेरीज़ डेवलपर्स को ब्लॉकचेन इंटरैक्शन्स बनाने, क्वेरी करने और प्रबंधित करने के लिए बहुमुखी उपकरण प्रदान करती हैं। चाहे आप JavaScript, TypeScript, Python या RESTful सेवाओं के साथ काम कर रहे हों, ये पोल्काडॉट-आधारित चेन्स से डेटा प्राप्त करने और उनके साथ कुशलतापूर्वक इंटरैक्ट करने की लचीलापन प्रदान करती हैं।"

    },
    source: { icon: "◇", type: "JavaScript, TypeScript", url: "https://docs.polkadot.com/develop/toolkit/api-libraries/", label: "substrate.dev" }
  },  
  {
    x: 0.264, y: 0.272, colorClass: 'dot-color-red', radius: 5,
    title: "Network interactions",
    text: {
    en: "List of examples that takes you through the basics of connecting to a local node, retrieving data from the Node and chain and execute transactions on the chain. It uses the [[ApiPromise]] interface.",
    es: "Lista de ejemplos que te guían a través de los conceptos básicos para conectarte a un nodo local, recuperar datos del nodo y la cadena, y ejecutar transacciones en la cadena. Utiliza la interfaz [[ApiPromise]].",
    pt: "Lista de exemplos que te conduz pelos conceitos básicos de conexão a um nó local, recuperação de dados do nó e da cadeia, e execução de transações na cadeia. Utiliza a interface [[ApiPromise]].",
    fr: "Liste d'exemples qui vous guide à travers les bases de la connexion à un nœud local, la récupération de données depuis le nœud et la chaîne, et l'exécution de transactions sur la chaîne. Elle utilise l'interface [[ApiPromise]].",
    de: "Liste von Beispielen, die Sie durch die Grundlagen der Verbindung mit einem lokalen Node, des Abrufs von Daten vom Node und der Chain sowie der Ausführung von Transaktionen auf der Chain führen. Verwendet die [[ApiPromise]]-Schnittstelle.",
    af: "Lys van voorbeelde wat jou deur die grondbeginselle lei om aan te sluit by 'n plaaslike node, data van die node en ketting te verkry, en transaksies op die ketting uit te voer. Dit gebruik die [[ApiPromise]]-koppelvlak.",
    zh: "示例列表，指导您完成连接本地节点、从节点和链检索数据以及在链上执行交易的基础知识。它使用[[ApiPromise]]接口。",
    hi: "उदाहरणों की सूची जो आपको एक स्थानीय नोड से कनेक्ट करने, नोड और चेन से डेटा प्राप्त करने और चेन पर लेन-देन निष्पादित करने की मूल बातें सिखाती है। यह [[ApiPromise]] इंटरफ़ेस का उपयोग करती है।"

    },
    source: { icon: "◇", type: "TBD", url: "https://polkadot.js.org/docs/api/examples/promise", label: "substrate.dev" }
  },
  {
    x: 0.262, y: 0.236, colorClass: 'dot-color-red', radius: 5,
    title: "App ui",
    text: {
    en: "The Polkadot-JS UI is the native application for accessing all features available on Substrate chains as Polkadot and Kusama. The UI is one of the moving parts of Polkadot-JS tool collection, and its functionalities go beyond normal wallet functionalities such as transfers.",
    es: "La interfaz de usuario de Polkadot-JS es la aplicación nativa para acceder a todas las funciones disponibles en las cadenas Substrate como Polkadot y Kusama. La interfaz es una de las partes móviles de la colección de herramientas Polkadot-JS, y sus funcionalidades van más allá de las funciones normales de una billetera, como las transferencias.",
    pt: "A interface do usuário Polkadot-JS é o aplicativo nativo para acessar todos os recursos disponíveis nas cadeias Substrate como Polkadot e Kusama. A interface é uma das partes móveis da coleção de ferramentas Polkadot-JS, e suas funcionalidades vão além das funções normais de uma carteira, como transferências.",
    fr: "L'interface utilisateur Polkadot-JS est l'application native permettant d'accéder à toutes les fonctionnalités disponibles sur les chaînes Substrate telles que Polkadot et Kusama. L'interface est l'un des éléments mobiles de la collection d'outils Polkadot-JS, et ses fonctionnalités vont au-delà des fonctions normales d'un portefeuille, comme les transferts.",
    de: "Die Polkadot-JS-UI ist die native Anwendung für den Zugriff auf alle Funktionen von Substrate-Chains wie Polkadot und Kusama. Die UI ist eines der beweglichen Teile der Polkadot-JS-Tool-Sammlung und ihre Funktionalitäten gehen über normale Wallet-Funktionen wie Überweisungen hinaus.",
    af: "Die Polkadot-JS-gebruikerskoppelvlak is die inheemse toepassing vir toegang tot alle funksies wat op Substrate-kettings soos Polkadot en Kusama beskikbaar is. Die koppelvlak is een van die bewegende dele van die Polkadot-JS-nutsversameling, en sy funksionaliteite gaan verder as normale beursiefunksies soos oordragte.",
    zh: "Polkadot-JS UI是用于访问Substrate链（如Polkadot和Kusama）上所有功能的原生应用程序。该UI是Polkadot-JS工具集合中的一个动态组成部分，其功能超越了普通钱包功能（如转账）。",
    hi: " पोल्काडॉट-जेएस यूआई सब्सट्रेट चेन जैसे पोल्काडॉट और कुसामा पर उपलब्ध सभी सुविधाओं तक पहुंच के लिए मूल एप्लिकेशन है। यह यूआई पोल्काडॉट-जेएस टूल संग्रह का एक हिस्सा है, और इसकी कार्यक्षमता सामान्य वॉलेट सुविधाओं जैसे ट्रांसफर से कहीं आगे है।"

    },
    source: { icon: "◇", type: "Javascript", url: "https://wiki.polkadot.network/general/polkadotjs-ui/", label: "substrate.dev" }
  },
  {
    x: 0.345, y: 0.244, colorClass: 'dot-color-red', radius: 5,
    title: "polkadot.js",
    text: {
    en: " Polkadot-JS is a collection of tools that interfaces with Relay Chains and parachains in a granular way. The API provides application developers the ability to query a node and interact with the Polkadot or Substrate chains using Javascript.",
    es: "Polkadot-JS es un conjunto de herramientas que interactúa con las Relay Chains y parachains de forma detallada. La API permite a los desarrolladores consultar nodos e interactuar con las cadenas de Polkadot o Substrate mediante Javascript.",
    pt: "Polkadot-JS é uma coleção de ferramentas que interage com Relay Chains e parachains de maneira granular. A API possibilita que desenvolvedores consultem nós e interajam com as blockchains Polkadot ou Substrate usando Javascript.",
    fr: "Polkadot-JS est une suite d'outils permettant d'interagir de manière granulaire avec les Relay Chains et parachains. Son API donne aux développeurs la capacité d'interroger un nœud et d'interagir avec les chaînes Polkadot ou Substrate en Javascript.",
    de: "Polkadot-JS ist eine Tool-Sammlung zur detaillierten Interaktion mit Relay Chains und Parachains. Die API ermöglicht Entwicklern das Abfragen von Nodes und die Interaktion mit Polkadot- oder Substrate-Chains mittels Javascript.",
    af: "Polkadot-JS is 'n versameling gereedskap wat fynmazig met Relay Chains en parachains kommunikeer. Die API stel app-ontwikkelaars in staat om 'n node te bevraagteken en met Polkadot- of Substrate-kettings via Javascript te interageer.",
    zh: "Polkadot-JS是一套工具集，可与中继链和平行链进行精细化交互。该API使开发者能够查询节点并使用Javascript与Polkadot或Substrate链进行交互。",
    hi: "पोल्काडॉट-जेएस टूल्स का एक संग्रह है जो रिले चेन और पैराचेन्स के साथ सूक्ष्म स्तर पर संवाद करता है। यह एपीआई डेवलपर्स को नोड प्रश्न करने और जावास्क्रिप्ट के माध्यम से पोल्काडॉट या सब्सट्रेट चेन के साथ इंटरैक्ट करने की सुविधा प्रदान करता है।"

    },
    source: { icon: "◇", type: "javascript, typescript, html", url: "https://polkadot.js.org/docs/", label: "substrate.dev" }
  },
  {
    x: 0.348, y: 0.36, colorClass: 'dot-color-red', radius: 5,
    title: "PAPI",
    text: {
    en: "Polkadot-API (PAPI) is a set of libraries built to be modular, composable, and grounded in a “light-client first” approach. Its primary aim is to equip dApp developers with an extensive toolkit for building fully decentralized applications.",
    es: "Polkadot-API (PAPI) es un conjunto de bibliotecas diseñadas para ser modulares, combinables y basadas en un enfoque 'light-client first'. Su objetivo principal es proporcionar a los desarrolladores de dApps un kit de herramientas completo para construir aplicaciones completamente descentralizadas.",
    pt: "Polkadot-API (PAPI) é um conjunto de bibliotecas construídas para serem modulares, combináveis e fundamentadas numa abordagem 'light-client first'. Seu principal objetivo é equipar desenvolvedores de dApps com um extenso conjunto de ferramentas para criar aplicações totalmente descentralizadas.",
    fr: "Polkadot-API (PAPI) est un ensemble de bibliothèques conçues pour être modulaires, composables et basées sur une approche 'light-client first'. Son objectif principal est de fournir aux développeurs de dApps une boîte à outils complète pour créer des applications entièrement décentralisées.",
    de: "Polkadot-API (PAPI) ist eine Sammlung modularer, kombinierbarer Bibliotheken mit einem 'Light-Client First'-Ansatz. Das Hauptziel ist es, dApp-Entwicklern umfangreiche Werkzeuge für die Erstellung vollständig dezentraler Anwendungen bereitzustellen.",
    af: "Polkadot-API (PAPI) is 'n stel biblioteke wat gebou is om modulêr, saamstelbaar en gegrond in 'n 'light-client first'-benadering te wees. Die hoofdoel is om dApp-ontwikkelaars toe te rus met 'n uitgebreide gereedskapstel om ten volle gedesentraliseerde toepassings te bou.",
    zh: "Polkadot-API (PAPI) 是一组采用模块化、可组合设计并以'轻客户端优先'为理念构建的库。其主要目标是为dApp开发者提供全面的工具包，用于构建完全去中心化的应用程序。",
    hi: "पोल्काडॉट-एपीआई (PAPI) मॉड्यूलर, संयोजनीय और 'लाइट-क्लाइंट फर्स्ट' दृष्टिकोण पर आधारित लाइब्रेरियों का एक सेट है। इसका प्राथमिक उद्देश्य dApp डेवलपर्स को पूर्ण विकेंद्रीकृत अनुप्रयोग बनाने के लिए एक व्यापक टूलकिट प्रदान करना है।"

    },
    source: { icon: "◇", type: "Typescript", url: "https://papi.how/", label: "substrate.dev" }
  },
  {
    x: 0.352, y: 0.455, colorClass: 'dot-color-red', radius: 5,
    title: "Snowbridge",
    text: {
    en: "Snowbridge by Snowfork is a general-purpose, trustless bridge between Polkadot and Ethereum. It utilizes the Bridge Hub system parachain to establish a connection to its relayers, allowing for permissionless and trustless messaging between Ethereum and Polkadot.",
    es: "Snowbridge de Snowfork es un puente sin confianza de propósito general entre Polkadot y Ethereum. Utiliza el parachain Bridge Hub para establecer conexión con sus relés, permitiendo mensajería sin permisos ni confianza entre Ethereum y Polkadot.",
    pt: "Snowbridge da Snowfork é uma ponte sem confiança de propósito geral entre Polkadot e Ethereum. Ela utiliza o parachain Bridge Hub para estabelecer conexão com seus relés, permitindo mensagens sem permissão e sem confiança entre Ethereum e Polkadot.",
    fr: "Snowbridge par Snowfork est un pont sans confiance à usage général entre Polkadot et Ethereum. Il utilise le parachain Bridge Hub pour établir une connexion avec ses relais, permettant une messagerie sans permission et sans confiance entre Ethereum et Polkadot.",
    de: "Snowbridge von Snowfork ist eine vertrauenslose, allgemeine Brücke zwischen Polkadot und Ethereum. Es nutzt den Bridge Hub System-Parachain, um eine Verbindung zu seinen Relais herzustellen und ermöglicht so erlaubnisfreie, vertrauenlose Kommunikation zwischen Ethereum und Polkadot.",
    af: "Snowbridge deur Snowfork is 'n algemene, vertrouenslose brug tussen Polkadot en Ethereum. Dit gebruik die Bridge Hub-stelselparachain om 'n verbinding met sy relais te bewerkstellig, wat permissielose en vertrouenslose boodskappe tussen Ethereum en Polkadot moontlik maak.",
    zh: "Snowfork开发的Snowbridge是Polkadot与以太坊之间的通用无信任桥接协议。它利用Bridge Hub系统平行链建立与中继节点的连接，实现以太坊与Polkadot之间的免许可、无信任消息传递。",
    hi: "स्नोफोर्क का स्नोब्रिज पोल्काडॉट और एथेरियम के बीच एक सामान्य-उद्देश्य, ट्रस्टलेस ब्रिज है। यह ब्रिज हब सिस्टम पैराचेन का उपयोग करके अपने रिलेयर्स से कनेक्शन स्थापित करता है, जिससे एथेरियम और पोल्काडॉट के बीच अनुमतिहीन और विश्वासरहित संदेशन सक्षम होता है।"

    },
    source: { icon: "◇", type: "go, typescript, solidity, rust", url: "https://github.com/snowfork/snowbridge", label: "substrate.dev" }
  },
  {
    x: 0.36, y: 0.578, colorClass: 'dot-color-red', radius: 5,
    title: "Polkassembly",
    text: {
    en: "Polkassembly is a platform specifically designed to foster open, transparent discussions around Polkadot and Kusama governance proposals. By bridging on-chain decisions with off-chain discussions, Polkassembly ensures that the community remains at the heart of the decision-making process.",
    es: "Polkassembly es una plataforma diseñada específicamente para fomentar debates abiertos y transparentes sobre las propuestas de gobernanza de Polkadot y Kusama. Al conectar las decisiones on-chain con discusiones off-chain, Polkassembly garantiza que la comunidad siga siendo el corazón del proceso de toma de decisiones.",
    pt: "Polkassembly é uma plataforma projetada especificamente para promover discussões abertas e transparentes sobre propostas de governança da Polkadot e Kusama. Ao conectar decisões on-chain com discussões off-chain, o Polkassembly assegura que a comunidade permaneça no centro do processo decisório.",
    fr: "Polkassembly est une plateforme spécialement conçue pour faciliter des discussions ouvertes et transparentes sur les propositions de gouvernance de Polkadot et Kusama. En reliant les décisions on-chain aux discussions off-chain, Polkassembly veille à ce que la communauté reste au cœur du processus décisionnel.",
    de: "Polkassembly ist eine speziell entwickelte Plattform zur Förderung offener, transparenter Diskussionen über Governance-Vorschläge für Polkadot und Kusama. Durch die Verknüpfung von On-Chain-Entscheidungen mit Off-Chain-Diskussionen stellt Polkassembly sicher, dass die Community im Mittelpunkt des Entscheidungsprozesses bleibt.",
    af: "Polkassembly is 'n platform wat spesifiek ontwerp is om oop, deursigtige besprekings oor Polkadot en Kusama se bestuursvoorstelle te bevorder. Deur on-chain besluite met off-chain besprekings te verbind, verseker Polkassembly dat die gemeenskap aan die hart van die besluitnemingsproses bly.",
    zh: "Polkassembly是一个专为促进Polkadot和Kusama治理提案公开透明讨论而设计的平台。通过将链上决策与链下讨论相结合，Polkassembly确保社区始终处于决策过程的核心位置。",
    hi: "पोल्कासेंबली एक ऐसा मंच है जो विशेष रूप से पोल्काडॉट और कुसामा के शासन प्रस्तावों पर खुली, पारदर्शी चर्चा को बढ़ावा देने के लिए डिज़ाइन किया गया है। ऑन-चेन निर्णयों को ऑफ-चेन चर्चाओं से जोड़कर, पोल्कासेंबली यह सुनिश्चित करता है कि समुदाय निर्णय लेने की प्रक्रिया के केंद्र में बना रहे।"

    },
    source: { icon: "◇", type: "Typescript", url: "https://github.com/polkassembly/polkassembly", label: "substrate.dev" }
  },
  {
    x: 0.347, y: 0.733, colorClass: 'dot-color-red', radius: 5,
    title: "Subscan",
    text: {
    en: "Empower your blockchain ecosystem with Subscan's advanced explorer solutions. Delivering real-time data, modular design, and full branding customization, enhancing transparency and accessibility at every step.",
    es: "Potencie su ecosistema blockchain con las soluciones avanzadas de explorador de Subscan. Ofreciendo datos en tiempo real, diseño modular y personalización total de marca, mejorando la transparencia y accesibilidad en cada paso.",
    pt: "Potencialize seu ecossistema blockchain com as soluções avançadas de explorador da Subscan. Fornecendo dados em tempo real, design modular e personalização total da marca, aumentando a transparência e acessibilidade em cada etapa.",
    fr: "Renforcez votre écosystème blockchain avec les solutions avancées d'explorateur de Subscan. Offrant des données en temps réel, une conception modulaire et une personnalisation complète de la marque, améliorant la transparence et l'accessibilité à chaque étape.",
    de: "Stärken Sie Ihr Blockchain-Ökosystem mit Subscans fortschrittlichen Explorer-Lösungen. Echtzeitdaten, modulares Design und vollständige Branding-Anpassung sorgen für mehr Transparenz und Zugänglichkeit in jeder Phase.",
    af: "Bemagtig u blockchain-ekosisteem met Subscan se gevorderde verkenneroplossings. Lewer intydse data, modulêre ontwerp en volledige handmerkustomisering wat deursigtigheid en toeganklikheid by elke stap verbeter.",
    zh: "通过Subscan的高级浏览器解决方案赋能您的区块链生态系统。提供实时数据、模块化设计和完整的品牌定制，在每一步提升透明度和可访问性。",
    hi: "सबस्कैन के उन्नत एक्सप्लोरर समाधानों से अपने ब्लॉकचेन इकोसिस्टम को सशक्त बनाएं। रियल-टाइम डेटा, मॉड्यूलर डिज़ाइन और पूर्ण ब्रांडिंग अनुकूलन प्रदान करते हुए, हर कदम पर पारदर्शिता और सुलभता को बढ़ाता है।"

    },
    source: { icon: "◇", type: "go, typescript, javascrip, rust, html", url: "https://github.com/subscan-explorer", label: "substrate.dev" }
  },
  {
    x: 0.342, y: 0.854, colorClass: 'dot-color-red', radius: 5,
    title: "Subxt",
    text: {
    en: "The subxt library maintained by Parity, to work with and extract PolkadotSDK/substrate based chains data for both reading data and submitting extrinsics.",
    es: "La biblioteca subxt, mantenida por Parity, permite trabajar y extraer datos de cadenas basadas en PolkadotSDK/Substrate, tanto para lectura de datos como para envío de extrínsecos.",
    pt: "A biblioteca subxt, mantida pela Parity, permite trabalhar e extrair dados de chains baseadas em PolkadotSDK/Substrate, tanto para leitura de dados quanto para submissão de extrínsecos.",
    fr: "La bibliothèque subxt, maintenue par Parity, permet de travailler avec et d'extraire des données des chaînes basées sur PolkadotSDK/Substrate, à la fois pour la lecture de données et la soumission d'extrinsèques.",
    de: "Die von Parity gepflegte subxt-Bibliothek ermöglicht die Arbeit mit und Extraktion von Daten aus PolkadotSDK/Substrate-basierten Chains, sowohl zum Lesen von Daten als auch zum Übermitteln von Extrinsics.",
    af: "Die subxt-biblioteek, onderhou deur Parity, werk met en onttrek data van PolkadotSDK/Substrate-gebaseerde kettings, vir beide data-lees en die indiening van ekstrinsieke.",
    zh: "由Parity维护的subxt库，用于处理和提取基于PolkadotSDK/Substrate的链数据，包括数据读取和外部交易提交。",
    hi: "पैरिटी द्वारा संचालित subxt लाइब्रेरी, पोल्काडॉटएसडीके/सब्सट्रेट आधारित चेन्स के डेटा के साथ कार्य करने और उसे निकालने के लिए है, जिसमें डेटा पढ़ना और एक्सट्रिंसिक्स जमा करना शामिल है"

    },
    source: { icon: "◇", type: "Rust", url: "https://github.com/paritytech/subxt", label: "substrate.dev" }
  },
  {
    x: 0.258, y: 0.36, colorClass: 'dot-color-red', radius: 5,
    title: "Smoldot",
    text: {
    en: "Lightweight client for Substrate-based chains, such as Polkadot and Kusama.",
    es: "Cliente ligero para cadenas basadas en Substrate, como Polkadot y Kusama.",
    pt: "Cliente leve para cadeias baseadas em Substrate, como Polkadot e Kusama.",
    fr: "Client léger pour les chaînes basées sur Substrate, telles que Polkadot et Kusama.",
    de: "Leichtgewichtiger Client für Substrate-basierte Chains wie Polkadot und Kusama.",
    af: "Liggewigkliënt vir Substrate-gebaseerde kettings soos Polkadot en Kusama.",
    zh: "适用于基于Substrate的链（如Polkadot和Kusama）的轻量级客户端。",
    hi: "सब्सट्रेट-आधारित चेन्स जैसे पोल्काडॉट और कुसामा के लिए हल्का क्लाइंट।"

    },
    source: { icon: "◇", type: "Rust", url: "https://github.com/smol-dot/smoldot", label: "substrate.dev" }
  },
  {
    x: 0.258, y: 0.388, colorClass: 'dot-color-red', radius: 5,
    title: "Metadata",
    text: {
    en: "The Metadata Explorer tool helps visualize the metadata of various parachains by retrieving the latest data directly from the chain using the polkadot-js api.",
    es: "La herramienta Metadata Explorer ayuda a visualizar los metadatos de varias parachains recuperando los datos más recientes directamente de la cadena mediante la API de polkadot-js.",
    pt: "A ferramenta Metadata Explorer auxilia na visualização dos metadados de várias parachains, recuperando os dados mais recentes diretamente da chain usando a API do polkadot-js.",
    fr: "L'outil Metadata Explorer permet de visualiser les métadonnées de diverses parachains en récupérant les données les plus récentes directement depuis la chaîne via l'API polkadot-js.",
    de: "Das Metadata Explorer-Tool visualisiert die Metadaten verschiedener Parachains, indem es die neuesten Daten direkt über die polkadot-js API von der Chain abruft.",
    af: "Die Metadata Explorer-instrument help om die metadata van verskeie parachains te visualiseer deur die nuutste data direk vanaf die ketting te verkry met behulp van die polkadot-js API.",
    zh: "Metadata Explorer工具通过使用polkadot-js API直接从链上检索最新数据，帮助可视化各种平行链的元数据。",
    hi: "मेटाडेटा एक्सप्लोरर टूल polkadot-js API का उपयोग करके सीधे चेन से नवीनतम डेटा प्राप्त करके विभिन्न पैराचेन्स के मेटाडेटा को विज़ुअलाइज़ करने में सहायता करता है।"

    },
    source: { icon: "◇", type: "TBD", url: "https://wiki.polkadot.network/general/metadata/", label: "substrate.dev" }
  },
  {
    x: 0.253, y: 0.443, colorClass: 'dot-color-red', radius: 5,
    title: "Snowfork ",
    text: {
    en: "Snowfork is a research and development group and an incubator of projects and developers that sprouted from a collection of elite developers, designers and product managers with years of experience collaborating on projects together.",
    es: "Snowfork es un grupo de investigación y desarrollo, así como un incubador de proyectos y desarrolladores, que surgió de un colectivo de desarrolladores, diseñadores y gestores de producto de élite con años de experiencia colaborando en proyectos conjuntos.",
    pt: "Snowfork é um grupo de pesquisa e desenvolvimento e uma incubadora de projetos e desenvolvedores, originado de um coletivo de desenvolvedores, designers e gerentes de produto de elite com anos de experiência em colaboração em projetos conjuntos.",
    fr: "Snowfork est un groupe de recherche et développement ainsi qu'un incubateur de projets et de développeurs, issu d'un collectif de développeurs, designers et product managers d'élite cumulant des années d'expérience en collaboration sur divers projets.",
    de: "Snowfork ist eine Forschungs- und Entwicklungsgruppe sowie ein Inkubator für Projekte und Entwickler, hervorgegangen aus einem Kreis von Elite-Entwicklern, Designern und Produktmanagern mit jahrelanger Erfahrung in gemeinsamer Projektarbeit.",
    af: "Snowfork is 'n navorsings- en ontwikkelingsgroep sowel as 'n aanblyplek vir projekte en ontwikkelaars wat ontstaan het uit 'n groep elite-ontwikkelaars, ontwerpers en produkbestuurders met jare se ervaring in gesamentlike projekte.",
    zh: "Snowfork是一个研发团体兼项目和开发者孵化器，由一群拥有多年项目合作经验的精英开发者、设计师和产品经理组成。",
    hi: "स्नोफोर्क एक शोध एवं विकास समूह और परियोजनाओं तथा डेवलपर्स का इन्क्यूबेटर है, जो एक समूह विशिष्ट डेवलपर्स, डिज़ाइनरों और उत्पाद प्रबंधकों से विकसित हुआ है, जिनके पास साझा परियोजनाओं पर वर्षों का सहयोगात्मक अनुभव है।"

    },
    source: { icon: "◇", type: "N/A", url: "https://snowfork.com/", label: "substrate.dev" }
  },
  {
    x: 0.265, y: 0.48, colorClass: 'dot-color-red', radius: 5,
    title: "Components",
    text: {
    en: "Our bridge enables communication between any Polkadot parachain and Ethereum using Polkadot's XCMP messaging protocol. Specifically, parachains can send XCM instructions to BridgeHub to use the bridge.",
    es: "Nuestro puente permite la comunicación entre cualquier parachain de Polkadot y Ethereum utilizando el protocolo de mensajería XCMP de Polkadot. Específicamente, las parachains pueden enviar instrucciones XCM a BridgeHub para utilizar el puente.",
    pt: "Nossa ponte possibilita a comunicação entre qualquer parachain da Polkadot e Ethereum usando o protocolo de mensagens XCMP da Polkadot. Especificamente, as parachains podem enviar instruções XCM para a BridgeHub para utilizar a ponte.",
    fr: "Notre pont permet la communication entre n'importe quelle parachain Polkadot et Ethereum en utilisant le protocole de messagerie XCMP de Polkadot. Concrètement, les parachains peuvent envoyer des instructions XCM à BridgeHub pour utiliser le pont.",
    de: "Unsere Brücke ermöglicht die Kommunikation zwischen beliebigen Polkadot-Parachains und Ethereum unter Verwendung des XCMP-Nachrichtenprotokolls von Polkadot. Insbesondere können Parachains XCM-Anweisungen an BridgeHub senden, um die Brücke zu nutzen.",
    af: "Ons brug maak kommunikasie moontlik tussen enige Polkadot-parachain en Ethereum deur Polkadot se XCMP-boodskapprotokol te gebruik. Spesifiek kan parachains XCM-instruksies aan BridgeHub stuur om die brug te gebruik.",
    zh: "我们的桥接系统通过Polkadot的XCMP消息协议实现任何Polkadot平行链与以太坊之间的通信。具体来说，平行链可以向BridgeHub发送XCM指令来使用该桥接。",
    hi: "हमारा ब्रिज पोल्काडॉट के XCMP मैसेजिंग प्रोटोकॉल का उपयोग करके किसी भी पोल्काडॉट पैराचेन और एथेरियम के बीच संचार सक्षम करता है। विशेष रूप से, पैराचेन्स ब्रिज का उपयोग करने के लिए XCM निर्देश BridgeHub को भेज सकते हैं।"

    },
    source: { icon: "◇", type: "TBD", url: "https://docs.snowbridge.network/architecture/components", label: "substrate.dev" }
  },
  {
    x: 0.266, y: 0.55, colorClass: 'dot-color-red', radius: 5,
    title: "Collectives",
    text: {
    en: "Collectives chain operates as a dedicated parachain exclusive to the Polkadot network with no counterpart on Kusama. This specialized infrastructure provides a foundation for various on-chain governance groups essential to Polkadot's ecosystem.",
    es: "La cadena Collectives opera como un parachain exclusivo de la red Polkadot sin equivalente en Kusama. Esta infraestructura especializada proporciona una base para diversos grupos de gobernanza on-chain esenciales para el ecosistema de Polkadot.",
    pt: "A cadeia Collectives opera como um parachain exclusivo da rede Polkadot, sem equivalente na Kusama. Esta infraestrutura especializada fornece uma base para diversos grupos de governança on-chain essenciais ao ecossistema Polkadot.",
    fr: "La chaîne Collectives fonctionne comme un parachain dédié exclusif au réseau Polkadot sans équivalent sur Kusama. Cette infrastructure spécialisée fournit une base pour divers groupes de gouvernance on-chain essentiels à l'écosystème Polkadot.",
    de: "Die Collectives-Chain operiert als spezieller, exklusiver Parachain für das Polkadot-Netzwerk ohne Gegenstück bei Kusama. Diese spezialisierte Infrastruktur bildet die Grundlage für verschiedene On-Chain-Governance-Gruppen, die für das Polkadot-Ökosystem essentiell sind.",
    af: "Die Collectives-ketting funksioneer as 'n toegewyde parachain wat eksklusief is aan die Polkadot-netwerk met geen eweknie op Kusama nie. Hierdie gespesialiseerde infrastruktuur bied 'n grondslag vir verskeie on-chain-governancegroepe wat noodsaaklik is vir die Polkadot-ekosisteem.",
    zh: "Collectives链作为Polkadot网络的专属平行链运行，在Kusama上没有对应物。这一专用基础设施为Polkadot生态系统所必需的各种链上治理团体提供了基础。",
    hi: "कलेक्टिव्स चेन पोल्काडॉट नेटवर्क के लिए एक समर्पित पैराचेन के रूप में कार्य करती है जिसका कुसामा पर कोई समकक्ष नहीं है। यह विशेषीकृत बुनियादी ढांचा पोल्काडॉट पारिस्थितिकी तंत्र के लिए आवश्यक विभिन्न ऑन-चेन शासन समूहों को एक आधार प्रदान करता है।"

    },
    source: { icon: "◇", type: "TBD", url: "https://collectives.polkassembly.io/", label: "substrate.dev" }
  },
  {
    x: 0.266, y: 0.582, colorClass: 'dot-color-red', radius: 5,
    title: "Staking dashboard",
    text: {
    en: "The Polkadot Staking Dashboard is a tool only dedicated to staking on Polkadot, Kusama (Polkadot's canary network) and Westend (Polkadot's test network).",
    es: "El Panel de Staking de Polkadot es una herramienta exclusivamente dedicada al staking en Polkadot, Kusama (la red canario de Polkadot) y Westend (la red de pruebas de Polkadot).",
    pt: "O Painel de Staking da Polkadot é uma ferramenta dedicada exclusivamente ao staking na Polkadot, Kusama (rede canário da Polkadot) e Westend (rede de testes da Polkadot).",
    fr: "Le Tableau de Bord de Staking Polkadot est un outil exclusivement dédié au staking sur Polkadot, Kusama (réseau canari de Polkadot) et Westend (réseau de test de Polkadot).",
    de: "Das Polkadot-Staking-Dashboard ist ein Tool, das ausschließlich für Staking auf Polkadot, Kusama (Polkadots Canary-Netzwerk) und Westend (Polkadots Testnetzwerk) entwickelt wurde.",
    af: "Die Polkadot Staking-dashboard is 'n instrument wat uitsluitlik toegewy is aan staking op Polkadot, Kusama (Polkadot se kanarienetwerk) en Westend (Polkadot se toetsnetwerk).",
    zh: "Polkadot质押仪表板是专用于Polkadot、Kusama（Polkadot的金丝雀网络）和Westend（Polkadot的测试网络）质押的工具。",
    hi: "पोल्काडॉट स्टेकिंग डैशबोर्ड एक ऐसा टूल है जो विशेष रूप से पोल्काडॉट, कुसामा (पोल्काडॉट का कैनरी नेटवर्क) और वेस्टेंड (पोल्काडॉट का टेस्ट नेटवर्क) पर स्टेकिंग के लिए समर्पित है।"

    },
    source: { icon: "◇", type: "typeScript, scss", url: "https://github.com/polkadot-cloud/polkadot-staking-dashboard", label: "substrate.dev" }
  },
  {
    x: 0.25, y: 0.615, colorClass: 'dot-color-red', radius: 5,
    title: "Townhall",
    text: {
    en: "Townhall is a social organization management super app designed for DAOs, DeFi protocols, and Communities. It enhances the governance experience by aggregating discussions , on and off chain proposals , treasury analytics and delegation.",
    es: "Townhall es una superaplicación de gestión de organizaciones sociales diseñada para DAOs, protocolos DeFi y comunidades. Mejora la experiencia de gobernanza mediante la agregación de discusiones, propuestas on-chain y off-chain, análisis de tesorería y delegación.",
    pt: "Townhall é um super aplicativo de gestão de organizações sociais projetado para DAOs, protocolos DeFi e comunidades. Ele aprimora a experiência de governança agregando discussões, propostas on-chain e off-chain, análises de tesouraria e delegação.",
    fr: "Townhall est une super application de gestion d'organisations sociales conçue pour les DAO, les protocoles DeFi et les communautés. Elle améliore l'expérience de gouvernance en agrégeant discussions, propositions on-chain et off-chain, analyses de trésorerie et délégation.",
    de: "Townhall ist eine Super-App für das Management sozialer Organisationen, entwickelt für DAOs, DeFi-Protokolle und Communities. Es verbessert das Governance-Erlebnis durch die Bündelung von Diskussionen, On- und Off-Chain-Proposal, Treasury-Analysen und Delegation.",
    af: "Townhall is 'n super-toepassing vir die bestuur van sosiale organisasies wat ontwerp is vir DAO's, DeFi-protokolle en gemeenskappe. Dit verbeter die bestuurservaring deur besprekings, on- en off-chain-voorstelle, tesourie-analise en delegasie saam te voeg.",
    zh: "Townhall是一款为DAO、DeFi协议和社区设计的社交组织管理超级应用。它通过整合讨论、链上链下提案、资金库分析和委托功能来增强治理体验。",
    hi: "टाउनहॉल DAO, DeFi प्रोटोकॉल और समुदायों के लिए डिज़ाइन किया गया एक सोशल ऑर्गनाइजेशन मैनेजमेंट सुपर ऐप है। यह चर्चाओं, ऑन-चेन और ऑफ-चेन प्रस्तावों, ट्रेजरी विश्लेषण और प्रतिनिधिमंडल को एकत्रित करके शासन अनुभव को बढ़ाता है।"

    },
    source: { icon: "◇", type: "JavaScript, TypeScrypt", url: "https://github.com/townhall-gov", label: "substrate.dev" }
  },
  {
    x: 0.256, y: 0.648, colorClass: 'dot-color-red', radius: 5,
    title: "PolkaSafe",
    text: {
    en: "Experience a new era of asset management with PolkaSafe. An all-improved. MultiSig experience on the Polkadot Blockchain.",
    es: "Experimenta una nueva era en la gestión de activos con PolkaSafe. Una experiencia MultiSign mejorada en la blockchain de Polkadot.",
    pt: "Vivencie uma nova era de gestão de ativos com o PolkaSafe. Uma experiência MultiSign aprimorada na blockchain Polkadot.",
    fr: "Vivez une nouvelle ère de gestion d'actifs avec PolkaSafe. Une expérience MultiSign améliorée sur la blockchain Polkadot.",
    de: "Erleben Sie ein neues Zeitalter der Vermögensverwaltung mit PolkaSafe. Ein verbessertes MultiSig-Erlebnis auf der Polkadot-Blockchain.",
    af: "Ervaar 'n nuwe era van batebestuur met PolkaSafe. 'n Volledig verbeterde MultiSig-ervaring op die Polkadot-blockchain.",
    zh: "通过PolkaSafe体验资产管理的新时代。在Polkadot区块链上全面提升的多签体验。",
    hi: "पोल्कासेफ़ के साथ संपत्ति प्रबंधन के एक नए युग का अनुभव करें। पोल्काडॉट ब्लॉकचेन पर एक संपूर्ण उन्नत मल्टीसिग अनुभव।"

    },
    source: { icon: "◇", type: "TypeScript", url: "https://github.com/polkasafe", label: "substrate.dev" }
  },
  {
    x: 0.246, y: 0.721, colorClass: 'dot-color-red', radius: 5,
    title: "Api Keys",
    text: {
    en: "With Subscan API, we provide a simple way to access the chain data of more than 90 substrate-based networks",
    es: "Con la API de Subscan, ofrecemos una forma sencilla de acceder a los datos de cadena de más de 90 redes basadas en Substrate.",
    pt: "Com a API Subscan, fornecemos uma maneira simples de acessar os dados de chain de mais de 90 redes baseadas em Substrate.",
    fr: "Avec l'API Subscan, nous proposons un moyen simple d'accéder aux données de chaîne de plus de 90 réseaux basés sur Substrate.",
    de: "Mit der Subscan-API bieten wir eine einfache Möglichkeit, auf die Chain-Daten von mehr als 90 Substrate-basierten Netzwerken zuzugreifen.",
    af: "Met die Subscan-API bied ons 'n eenvoudige manier om toegang te verkry tot die kettingdata van meer as 90 Substrate-gebaseerde netwerke.",
    zh: "通过Subscan API，我们提供了一种简单的方式来访问90多个基于Substrate网络的链上数据。",
    hi: "सबस्कैन एपीआई के साथ, हम 90 से अधिक सब्सट्रेट-आधारित नेटवर्क्स के चेन डेटा तक पहुंचने का एक सरल तरीका प्रदान करते हैं।"

    },
    source: { icon: "◇", type: "TBD", url: "https://support.subscan.io/doc-361776#api-keys", label: "substrate.dev" }
  },
  {
    x: 0.261, y: 0.754, colorClass: 'dot-color-red', radius: 5,
    title: "ApiEndpoints",
    text: {
    en: "The following endpoints list is maintained mannually and it might be outdated. In fact, every individual network supported on Subscan.io will have available API endpoint as well. The endpoint naming convention is https://$NETWORK_NAME.api.subscan.io where the $NETWORK_NAME is the same as the subdomain of the corresponding network on Subscan.io." ,
    es: "La siguiente lista de endpoints se mantiene manualmente y podría estar desactualizada. De hecho, cada red individual compatible con Subscan.io tendrá también su endpoint API disponible. La convención de nombres para los endpoints es https://$NETWORK_NAME.api.subscan.io, donde $NETWORK_NAME es el mismo que el subdominio de la red correspondiente en Subscan.io.",
    pt: "A lista seguinte de endpoints é mantida manualmente e pode estar desatualizada. Na verdade, cada rede individual suportada no Subscan.io terá também um endpoint API disponível. A convenção de nomenclatura dos endpoints é https://$NETWORK_NAME.api.subscan.io, onde $NETWORK_NAME é o mesmo que o subdomínio da rede correspondente no Subscan.io.",
    fr: "La liste suivante de points de terminaison est maintenue manuellement et pourrait être obsolète. En fait, chaque réseau individuel pris en charge sur Subscan.io disposera également d'un point de terminaison API disponible. La convention de nommage des points de terminaison est https://$NETWORK_NAME.api.subscan.io, où $NETWORK_NAME est le même que le sous-domaine du réseau correspondant sur Subscan.io.",
    de: "Die folgende Endpunktliste wird manuell gepflegt und könnte veraltet sein. Tatsächlich verfügt jedes einzelne auf Subscan.io unterstützte Netzwerk auch über einen API-Endpunkt. Die Namenskonvention für Endpunkte lautet https://$NETWORK_NAME.api.subscan.io, wobei $NETWORK_NAME dem Subdomain des entsprechenden Netzwerks auf Subscan.io entspricht.",
    af: "Die volgende eindpuntlys word handmatig onderhou en mag verouderd wees. Trouens, elke individuele netwerk wat op Subscan.io ondersteun word, sal ook 'n beskikbare API-eindpunt hê. Die eindpuntbenamingskonvensie is https://$NETWORK_NAME.api.subscan.io, waar $NETWORK_NAME dieselfde is as die subdomein van die ooreenstemmende netwerk op Subscan.io.",
    zh: "以下端点列表为人工维护，可能不是最新版本。实际上，Subscan.io支持的每个独立网络都将提供可用的API端点。端点命名规则为https://$NETWORK_NAME.api.subscan.io，其中$NETWORK_NAME与该网络在Subscan.io上的子域名相同。",
    hi: "निम्नलिखित एंडपॉइंट सूची मैन्युअली रखरखाव की जाती है और यह अद्यतन नहीं हो सकती है। वास्तव में, Subscan.io पर समर्थित प्रत्येक व्यक्तिगत नेटवर्क में एक उपलब्ध API एंडपॉइंट भी होगा। एंडपॉइंट नामकरण परंपरा https://$NETWORK_NAME.api.subscan.io है, जहां $NETWORK_NAME, Subscan.io पर संबंधित नेटवर्क के सबडोमेन के समान है।"

    },
    source: { icon: "◇", type: "shell, javascript, java, swift, go, php, python, http, c, c#, ruby, dart", url: "https://substrate.dev", label: "substrate.dev" }
  },
  {
    x: 0.268, y: 0.855, colorClass: 'dot-color-red', radius: 5,
    title: "Interface",
    text: {
    en: "It provides a type-safe interface for submitting transactions, querying on-chain state, and performing other blockchain interactions. By leveraging Rust's strong type system, subxt ensures that your code is validated at compile time, reducing runtime errors and improving reliability.",
    es: "Proporciona una interfaz con verificación de tipos para enviar transacciones, consultar el estado de la cadena y realizar otras interacciones con la blockchain. Al aprovechar el sólido sistema de tipos de Rust, subxt garantiza que tu código sea validado en tiempo de compilación, reduciendo errores en tiempo de ejecución y mejorando la fiabilidad.",
    pt: "Oferece uma interface com verificação de tipos para submeter transações, consultar o estado on-chain e realizar outras interações com a blockchain. Ao utilizar o robusto sistema de tipos do Rust, o subxt assegura que seu código seja validado em tempo de compilação, reduzindo erros de runtime e aumentando a confiabilidade.",
    fr: "Il fournit une interface type-safe pour soumettre des transactions, interroger l'état on-chain et effectuer d'autres interactions blockchain. En tirant parti du système de types fort de Rust, subxt garantit que votre code est validé au moment de la compilation, réduisant ainsi les erreurs d'exécution et améliorant la fiabilité.",
    de: "Es bietet eine typsichere Schnittstelle zum Übermitteln von Transaktionen, Abfragen des On-Chain-Zustands und Durchführen anderer Blockchain-Interaktionen. Durch die Nutzung des starken Typsystems von Rust stellt subxt sicher, dass Ihr Code während der Kompilierung validiert wird, was Laufzeitfehler reduziert und die Zuverlässigkeit verbessert.",
    af: "Dit bied 'n tipe-veilige koppelvlak vir die indiening van transaksies, ondersoek van on-chain toestand en uitvoering van ander blockchain-interaksies. Deur gebruik te maak van Rust se sterk tipe-stelsel, verseker subxt dat jou kode tydens samestelling gevalideer word, wat runtime-foute verminder en betroubaarheid verbeter.",
    zh: "它提供了类型安全的接口用于提交交易、查询链上状态和执行其他区块链交互。通过利用Rust强大的类型系统，subxt确保您的代码在编译时得到验证，减少运行时错误并提高可靠性。",
    hi: "यह ट्रांजैक्शन जमा करने, ऑन-चेन स्टेट क्वेरी करने और अन्य ब्लॉकचेन इंटरैक्शन करने के लिए एक टाइप-सेफ इंटरफेस प्रदान करता है। रस्ट की मजबूत टाइप सिस्टम का लाभ उठाकर, subxt सुनिश्चित करता है कि आपका कोड कंपाइल समय पर वैलिडेट हो, जिससे रनटाइम एरर कम हो और विश्वसनीयता बढ़े।"

    },
    source: { icon: "◇", type: "Rust", url: "https://docs.polkadot.com/develop/toolkit/api-libraries/subxt/", label: "substrate.dev" }
  },
  {
    x: 0.193, y: 0.848, colorClass: 'dot-color-red', radius: 5,
    title: "RPC communicate",
    text: {
    en: " fundamental operations of subxt, from setting up your environment to executing transactions and querying blockchain state.",
    es: "operaciones fundamentales de subxt, desde la configuración de tu entorno hasta la ejecución de transacciones y consultas del estado de la blockchain.",
    pt: "operações fundamentais do subxt, desde a configuração do seu ambiente até a execução de transações e consultas do estado da blockchain.",
    fr: "opérations fondamentales de subxt, de la configuration de votre environnement à l'exécution de transactions et à l'interrogation de l'état de la blockchain.",
    de: "grundlegende Operationen von subxt, von der Einrichtung Ihrer Umgebung bis zur Ausführung von Transaktionen und Abfragen des Blockchain-Zustands.",
    af: "fundamentele operasies van subxt, vanaf die opstelling van jou omgewing tot die uitvoering van transaksies en ondersoek van die blockchain-toestand.",
    zh: "subxt的基本操作，从设置环境到执行交易和查询区块链状态。",
    hi: "subxt के मूलभूत संचालन, आपका वातावरण सेटअप करने से लेकर लेन-देन निष्पादित करने और ब्लॉकचेन स्थिति क्वेरी करने तक।"

    },
    source: { icon: "◇", type: "Rust", url: "https://docs.rs/subxt/latest/subxt/book/index.html", label: "substrate.dev" }
  },
  {
    x: 0.506, y: 0.42, colorClass: 'dot-color-green', radius: 7,
    title: "Parachains",
    text: {
    en: "A parachain is an application-specific data structure that is globally coherent and can be validated by the validators of the relay chain.",
    es: "Una parachain es una estructura de datos específica para aplicaciones que es globalmente coherente y puede ser validada por los validadores de la cadena de retransmisión.",
    pt: "Uma parachain é uma estrutura de dados específica para aplicações que é globalmente coerente e pode ser validada pelos validadores da cadeia de retransmissão.",
    fr: "Une parachain est une structure de données spécifique à une application qui est globalement cohérente et peut être validée par les validateurs de la chaîne relais.",
    de: "Eine Parachain ist eine anwendungsspezifische Datenstruktur, die global konsistent ist und von den Validatoren der Relay-Chain validiert werden kann.",
    af: "'n Parachain is 'n toepassingspesifieke datastruktuur wat wêreldwyd samehangend is en deur die valideerders van die aflosketting gevalideer kan word.",
    zh: "平行链是一种应用特定的数据结构，具有全局一致性，可由中继链的验证者进行验证。",
    hi: "एक पैराचेन एक एप्लिकेशन-विशिष्ट डेटा संरचना है जो वैश्विक रूप से सुसंगत है और रिले चेन के वैलिडेटर्स द्वारा सत्यापित की जा सकती है।"

    },
    source: { icon: "◎", type: "Info", url: "https://wiki.polkadot.network/learn/learn-parachains/", label: "polkadot.network" }
  },
  {
    x: 0.533, y: 0.635, colorClass: 'dot-color-green', radius: 7,
    title: "Cumulus",
    text: {
    en: "It enables different consensus systems to communicate with each other in an expressive manner. Consensus systems include blockchains, smart contracts, and any other state machine that achieves consensus in some way.",
    es: "Permite que diferentes sistemas de consenso se comuniquen entre sí de manera expresiva. Los sistemas de consenso incluyen blockchains, contratos inteligentes y cualquier otra máquina de estados que logre consenso de alguna manera.",
    pt: "Ele permite que diferentes sistemas de consenso comuniquem entre si de forma expressiva. Os sistemas de consenso incluem blockchains, contratos inteligentes e qualquer outra máquina de estados que alcance consenso de alguma forma.",
    fr: "Il permet à différents systèmes de consensus de communiquer entre eux de manière expressive. Les systèmes de consensus incluent les blockchains, les smart contracts et toute autre machine à états qui atteint un consensus d'une manière ou d'une autre.",
    de: "Es ermöglicht verschiedenen Konsenssystemen, auf ausdrucksstarke Weise miteinander zu kommunizieren. Zu den Konsenssystemen gehören Blockchains, Smart Contracts und alle anderen Zustandsautomaten, die auf irgendeine Weise Konsens erreichen.",
    af: "Dit maak dit moontlik vir verskillende konsensusstelsels om op 'n uitdruklike wyse met mekaar te kommunikeer. Konsensusstelsels sluit blockchains, slimkontrakte en enige ander toestandmasjien wat op een of ander manier konsensus bereik, in.",
    zh: "它使不同的共识系统能够以富有表现力的方式相互通信。共识系统包括区块链、智能合约以及任何以某种方式达成共识的状态机。",
    hi: "यह विभिन्न सहमति प्रणालियों को एक अभिव्यंजक तरीके से एक-दूसरे के साथ संचार करने में सक्षम बनाता है। सहमति प्रणालियों में ब्लॉकचेन, स्मार्ट कॉन्ट्रैक्ट्स और कोई अन्य स्टेट मशीन शामिल है जो किसी तरह सहमति प्राप्त करती है।"

    },
    source: { icon: "◎", type: "Rust", url: "https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/polkadot_sdk/cumulus/index.html", label: "polkadot.network" }
  },
  {
    x: 0.446, y: 0.635, colorClass: 'dot-color-green', radius: 7,
    title: "XCM",
    text: {
    en: "XCM is a standard, specification of which lives in the xcm format repo. It’s agnostic both in programming language and blockchain platform, which means it could be used in Rust in Polkadot, or in Go or C++ in any other platform like Cosmos or Ethereum. It enables different consensus systems to communicate with each other in an expressive manner. Consensus systems include blockchains, smart contracts, and any other state machine that achieves consensus in some way",
    es: "XCM es un estándar cuya especificación reside en el repositorio de formato xcm. Es agnóstico tanto en lenguaje de programación como en plataforma blockchain, lo que significa que podría usarse en Rust en Polkadot, o en Go o C++ en cualquier otra plataforma como Cosmos o Ethereum. Permite que diferentes sistemas de consenso se comuniquen entre sí de manera expresiva. Los sistemas de consenso incluyen blockchains, contratos inteligentes y cualquier otra máquina de estados que logre consenso de alguna manera.",
    pt: "XCM é um padrão cuja especificação está no repositório de formato xcm. É agnóstico tanto em linguagem de programação quanto em plataforma blockchain, o que significa que pode ser usado em Rust no Polkadot, ou em Go ou C++ em qualquer outra plataforma como Cosmos ou Ethereum. Permite que diferentes sistemas de consenso se comuniquem de forma expressiva. Os sistemas de consenso incluem blockchains, contratos inteligentes e qualquer outra máquina de estados que alcance consenso de alguma forma.",
    fr: "XCM est un standard dont les spécifications se trouvent dans le dépôt de format xcm. Il est agnostique à la fois en langage de programation et plateforme blockchain, ce qui signifie qu'il pourrait être utilisé en Rust dans Polkadot, ou en Go ou C++ dans toute autre plateforme comme Cosmos ou Ethereum. Il permet à différents systèmes de consensus de communiquer entre eux de manière expressive. Les systèmes de consensus incluent les blockchains, les smart contracts et toute autre machine à états qui atteint un consensus d'une manière ou d'une autre.",
    de: "XCM ist ein Standard, dessen Spezifikation im xcm-Format-Repository liegt. Es ist sowohl programmiersprachen- als auch blockchain-plattformagnostisch, was bedeutet, dass es in Rust in Polkadot oder in Go oder C++ in jeder anderen Plattform wie Cosmos oder Ethereum verwendet werden könnte. Es ermöglicht verschiedenen Konsenssystemen, auf ausdrucksstarke Weise miteinander zu kommunizieren. Zu den Konsenssystemen gehören Blockchains, Smart Contracts und alle anderen Zustandsautomaten, die auf irgendeine Weise Konsens erreichen.",
    af: "XCM is 'n standaard waarvan die spesifikasie in die xcm-formaat-bewaarplek geleë is. Dit is agnosties ten opsigte van beide programmeringstaal en blockchain-platform, wat beteken dat dit in Rust in Polkadot, of in Go of C++ in enige ander platform soos Cosmos of Ethereum gebruik kan word. Dit maak dit moontlik vir verskillende konsensusstelsels om op 'n uitdruklike wyse met mekaar te kommunikeer. Konsensusstelsels sluit blockchains, slimkontrakte en enige ander toestandmasjien wat op een of ander manier konsensus bereik, in.",
    zh: "XCM是一个标准，其规范存在于xcm格式仓库中。它在编程语言和区块链平台方面都是不可知的，这意味着它可以在Polkadot中用Rust，或在其他平台如Cosmos或Ethereum中用Go或C++。它使不同的共识系统能够以富有表现力的方式相互通信。共识系统包括区块链、智能合约以及任何以某种方式达成共识的状态机。",
    hi: "XCM एक मानक है जिसका विशिष्टीकरण xcm फॉर्मेट रेपो में है। यह प्रोग्रामिंग भाषा और ब्लॉकचेन प्लेटफॉर्म दोनों में तटस्थ है, जिसका अर्थ है कि इसका उपयोग पोल्काडॉट में Rust में, या किसी अन्य प्लेटफॉर्म जैसे Cosmos या Ethereum में Go या C++ में किया जा सकता है। यह विभिन्न सहमति प्रणालियों को एक अभिव्यंजक तरीके से एक-दूसरे के साथ संचार करने में सक्षम बनाता है। सहमति प्रणालियों में ब्लॉकचेन, स्मार्ट कॉन्ट्रैक्ट्स और कोई अन्य स्टेट मशीन शामिल है जो किसी तरह सहमति प्राप्त करती है।"

    },
    source: { icon: "◎", type: "Rust", url: "https://wiki.polkadot.network/learn/learn-xcm/", label: "polkadot.network" }
  },
  {
    x: 0.459, y: 0.71, colorClass: 'dot-color-green', radius: 7,
    title: "Cross chain applications",
    text: {
    en: "Complete description of the cross-consensus message format",
    es: "Descripción completa del formato de mensajes entre consensos (cross-consensus)",
    pt: "Descrição completa do formato de mensagem entre consensos (cross-consensus)",
    fr: "Description complète du format de message inter-consensus (cross-consensus)",
    de: "Vollständige Beschreibung des Cross-Consensus-Nachrichtenformats",
    af: "Volledige beskrywing van die kruis-konsensus boodskapformaat",
    zh: "跨共识消息格式的完整说明",
    hi: "क्रॉस-कंसेंसस संदेश प्रारूप का पूर्ण विवरण"

    },
    source: { icon: "◎", type: "TBD", url: "https://github.com/polkadot-fellows/xcm-format", label: "polkadot.network" }
  },
  {
    x: 0.535, y: 0.70, colorClass: 'dot-color-green', radius: 7,
    title: "Async backing",
    text: {
    en: "This guide is relevant for cumulus based parachain projects started in 2023 or before. Later projects should already be async backing compatible.",
    es: "Esta guía es relevante para proyectos de parachain basados en Cumulus iniciados en 2023 o antes. Los proyectos posteriores ya deberían ser compatibles con async backing.",
    pt: "Este guia é relevante para projetos de parachain baseados em Cumulus iniciados em 2023 ou antes. Projetos posteriores já devem ser compatíveis com async backing.",
    fr: "Ce guide concerne les projets de parachain basés sur Cumulus démarrés en 2023 ou avant. Les projets ultérieurs devraient déjà être compatibles avec async backing.",
    de: "Diese Anleitung ist relevant für Cumulus-basierte Parachain-Projekte, die 2023 oder früher gestartet wurden. Spätere Projekte sollten bereits async backing-kompatibel sein.",
    af: "Hierdie gids is relevant vir Cumulus-gebaseerde parachain-projekte wat in 2023 of vroeër begin is. Later projekte behoort reeds async backing-verenigbaar te wees.",
    zh: "本指南适用于2023年或之前启动的基于Cumulus的平行链项目。后续项目应已兼容异步支持(async backing)。",
    hi: "यह गाइड 2023 या उससे पहले शुरू किए गए क्यूम्युलस-आधारित पैराचेन परियोजनाओं के लिए प्रासंगिक है। बाद की परियोजनाएं पहले से ही एसिंक बैकिंग के साथ संगत होनी चाहिए।"

    },
    source: { icon: "◎", type: "Info", url: "https://wiki.polkadot.network/learn/maintain-guides-async-backing/#phase-1-update-parachain-runtime", label: "polkadot.network" }
  },
  {
    x: 0.615, y: 0.665, colorClass: 'dot-color-green', radius: 7,
    title: "Solochain",
    text: {
    en: "Solochains manage their own consensus and security and do not participate in Polkadot’s cross-chain messaging or shared validation logic by default. They are useful for experimentation, learning, or use cases that do not require integration with the broader Polkadot ecosystem",
    es: "Las solochains gestionan su propio consenso y seguridad y no participan en los mensajes entre cadenas ni en la lógica de validación compartida de Polkadot por defecto. Son útiles para experimentación, aprendizaje o casos de uso que no requieren integración con el ecosistema más amplio de Polkadot.",
    pt: "As solochains gerenciam seu próprio consenso e segurança e não participam das mensagens entre cadeias nem da lógica de validação compartilhada da Polkadot por padrão. São úteis para experimentação, aprendizado ou casos de uso que não exigem integração com o ecossistema mais amplo da Polkadot.",
    fr: "Les solochains gèrent leur propre consensus et sécurité et ne participent pas par défaut aux messages inter-chaînes ni à la logique de validation partagée de Polkadot. Elles sont utiles pour l'expérimentation, l'apprentissage ou les cas d'usage ne nécessitant pas d'intégration avec l'écosystème Polkadot au sens large.",
    de: "Solochains verwalten ihren eigenen Konsens und Sicherheit und nehmen standardmäßig nicht an der Cross-Chain-Kommunikation oder der gemeinsamen Validierungslogik von Polkadot teil. Sie sind nützlich für Experimente, Lernzwecke oder Anwendungsfälle, die keine Integration in das größere Polkadot-Ökosystem erfordern.",
    af: "Solochains bestuur hul eie konsensus en sekuriteit en neem nie standaard deel aan Polkadot se kruis-ketting boodskappe of gedeelde valideringslogika nie. Dit is nuttig vir eksperimentering, leer of gebruiksgevalle wat nie integrasie met die breër Polkadot-ekosisteem vereis nie.",
    zh: "独立链(Solochains)自行管理其共识和安全机制，默认不参与Polkadot的跨链消息传递或共享验证逻辑。它们适用于实验、学习或不需要与更广泛的Polkadot生态系统集成的用例。",
    hi: "सोलोचेन्स अपना सहमति और सुरक्षा प्रबंधित करती हैं और डिफ़ॉल्ट रूप से पोल्काडॉट के क्रॉस-चेन मैसेजिंग या साझा सत्यापन तर्क में भाग नहीं लेती हैं। ये प्रयोग, सीखने या उन उपयोग मामलों के लिए उपयोगी हैं जिन्हें व्यापक पोल्काडॉट पारिस्थितिकी तंत्र के साथ एकीकरण की आवश्यकता नहीं होती है।"

    },
    source: { icon: "◎", type: "Rust", url: "https://github.com/paritytech/polkadot-sdk/tree/master/templates/solochain", label: "polkadot.network" }
  },
  {
    x: 0.605, y: 0.7, colorClass: 'dot-color-green', radius: 7,
    title: "Dapps",
    text: {
    en: "Polkadot offers developers flexibility in building smart contracts, supporting both Wasm-based contracts using ink! (written in Rust) and Solidity contracts executed by the EVM (Ethereum Virtual Machine).",
    es: "Polkadot ofrece a los desarrolladores flexibilidad para crear contratos inteligentes, compatible tanto con contratos basados en Wasm usando ink! (escritos en Rust) como con contratos en Solidity ejecutados por la EVM (Máquina Virtual de Ethereum).",
    pt: "Polkadot oferece flexibilidade aos desenvolvedores na criação de contratos inteligentes, suportando tanto contratos baseados em Wasm usando ink! (escritos em Rust) quanto contratos em Solidity executados pela EVM (Máquina Virtual de Ethereum).",
    fr: "Polkadot offre aux développeurs une grande flexibilité pour créer des contrats intelligents, prenant en charge à la fois les contrats basés sur Wasm utilisant ink! (écrits en Rust) et les contrats Solidity exécutés par l'EVM (Machine Virtuelle Ethereum).",
    de: "Polkadot bietet Entwicklern Flexibilität beim Erstellen von Smart Contracts, mit Unterstützung für sowohl Wasm-basierte Contracts mit ink! (in Rust geschrieben) als auch Solidity-Contracts, die von der EVM (Ethereum Virtual Machine) ausgeführt werden.",
    af: "Polkadot bied ontwikkelaars buigsaamheid in die bou van slimkontrakte, met ondersteuning vir beide Wasm-gebaseerde kontrakte met ink! (geskryf in Rust) en Solidity-kontrakte wat deur die EVM (Ethereum Virtuele Masjien) uitgevoer word.",
    zh: "Polkadot为开发者提供了构建智能合约的灵活性，既支持使用ink!（基于Rust编写）的Wasm合约，也支持由EVM（以太坊虚拟机）执行的Solidity合约。",
    hi: "पोल्काडॉट डेवलपर्स को स्मार्ट कॉन्ट्रैक्ट्स बनाने में लचीलापन प्रदान करता है, जो ink! (Rust में लिखे गए) का उपयोग करके Wasm-आधारित कॉन्ट्रैक्ट्स और EVM (इथेरियम वर्चुअल मशीन) द्वारा निष्पादित सॉलिडिटी कॉन्ट्रैक्ट्स दोनों को सपोर्ट करता है।"

    },
    source: { icon: "◎", type: "TBD", url: "https://docs.polkadot.com/develop/smart-contracts/", label: "polkadot.network" }
  },
  {
    x: 0.613, y: 0.761, colorClass: 'dot-color-green', radius: 7,
    title: "Pokadot unity sdk",
    text: {
    en: "The Polkadot SDK for Unity is more than just a wallet wrapper; it's a full-fledged solution enabling Unity developers to access blockchain functionalities with ease. Ideal for both gaming and application development, this SDK makes blockchain integration straightforward and efficient.",
    es: "El SDK de Polkadot para Unity va más allá de ser un simple envoltorio para carteras; es una solución completa que permite a los desarrolladores de Unity acceder fácilmente a funcionalidades blockchain. Ideal tanto para el desarrollo de juegos como de aplicaciones, este SDK simplifica y agiliza la integración con blockchain.",
    pt: "O SDK da Polkadot para Unity não é apenas um invólucro para carteiras; é uma solução completa que permite aos desenvolvedores Unity acessar funcionalidades blockchain com facilidade. Ideal para desenvolvimento de jogos e aplicativos, este SDK torna a integração blockchain simples e eficiente.",
    fr: "Le SDK Polkadot pour Unity est bien plus qu'une simple interface de portefeuille ; c'est une solution complète permettant aux développeurs Unity d'accéder facilement aux fonctionnalités blockchain. Idéal pour le développement de jeux et d'applications, ce SDK rend l'intégration blockchain intuitive et efficace.",
    de: "Das Polkadot SDK für Unity ist mehr als nur eine Wallet-Hülle; es ist eine vollwertige Lösung, die Unity-Entwicklern den einfachen Zugang zu Blockchain-Funktionen ermöglicht. Ideal für die Spiel- und Anwendungsentwicklung macht dieses SDK die Blockchain-Integration unkompliziert und effizient.",
    af: "Die Polkadot SDK vir Unity is meer as net 'n beursie-omhulsel; dit is 'n volwaardige oplossing wat Unity-ontwikkelaars in staat stel om blokkettingfunksies met gemak te benut. Ideaal vir beide speletjie- en toepassingontwikkeling, hierdie SDK maak blokketting-integrasie reguit en doeltreffend.",
    zh: "Polkadot的Unity SDK不仅仅是一个钱包封装工具，它是一个成熟的解决方案，让Unity开发者能够轻松访问区块链功能。无论是游戏开发还是应用开发，这款SDK都能实现直观高效的区块链集成。",
    hi: "यूनिटी के लिए पोल्काडॉट एसडीके केवल एक वॉलेट रैपर से कहीं अधिक है; यह एक संपूर्ण समाधान है जो यूनिटी डेवलपर्स को ब्लॉकचेन कार्यक्षमताओं तक सहज पहुंच प्रदान करता है। गेमिंग और एप्लिकेशन विकास दोनों के लिए आदर्श, यह एसडीके ब्लॉकचेन एकीकरण को सीधा और कुशल बनाता है।"

    },
    source: { icon: "◎", type: "C#", url: "https://github.com/ajuna-network/Polkadot.Unity.SDK", label: "polkadot.network" }
  },
  {
    x: 0.613, y: 0.79, colorClass: 'dot-color-green', radius: 7,
    title: "Polkadot Unreal Engine sdk",
    text: {
    en: "To be defined",
    es: "Por definir",
    pt: "A definir",
    fr: "À définir",
    de: "Noch zu definieren",
    af: "Om te definieer",
    zh: "待定义",
    hi: "परिभाषित किया जाना है"

    },
    source: { icon: "◎", type: "C++", url: "https://github.com/ajuna-network/substrate-unreal-engine", label: "polkadot.network" }
  },
  {
    x: 0.613, y: 0.82, colorClass: 'dot-color-green', radius: 5,
    title: "Substrate gamming SDK",
    text: {
    en: "With a gaming SDK for substrate (https://github.com/paritytech/substrate/), game developers can easily integrate their games with substrate-based blockchains and take their gaming experience to the next level.",
    es: "Con un SDK de gaming para Substrate (https://github.com/paritytech/substrate/), los desarrolladores de juegos pueden integrar fácilmente sus juegos con blockchains basadas en Substrate y llevar su experiencia de juego al siguiente nivel.",
    pt: "Com um SDK de jogos para Substrate (https://github.com/paritytech/substrate/), desenvolvedores de jogos podem integrar facilmente seus jogos com blockchains baseadas em Substrate e elevar sua experiência de jogo a um novo patamar.",
    fr: "Avec un SDK gaming pour Substrate (https://github.com/paritytech/substrate/), les développeurs de jeux peuvent facilement intégrer leurs jeux avec des blockchains basées sur Substrate et faire passer leur expérience de jeu au niveau supérieur.",
    de: "Mit einem Gaming-SDK für Substrate (https://github.com/paritytech/substrate/) können Spieleentwickler ihre Spiele einfach mit Substrate-basierten Blockchains integrieren und ihr Spielerlebnis auf das nächste Level heben.",
    af: "Met 'n gaming-SDK vir Substrate (https://github.com/paritytech/substrate/) kan spelontwikkelaars hul speletjies maklik integreer met Substrate-gebaseerde blokkettinge en hul speelervaring na 'n nuwe vlak neem.",
    zh: "通过Substrate的游戏SDK (https://github.com/paritytech/substrate/)，游戏开发者可以轻松将其游戏与基于Substrate的区块链集成，并将游戏体验提升到新的水平。",
    hi: "सब्सट्रेट के लिए एक गेमिंग एसडीके (https://github.com/paritytech/substrate/) के साथ, गेम डेवलपर्स आसानी से अपने गेम्स को सब्सट्रेट-आधारित ब्लॉकचेन के साथ एकीकृत कर सकते हैं और गेमिंग अनुभव को अगले स्तर तक ले जा सकते हैं।"

    },
    source: { icon: "◎", type: "C#, Rust, Solidity", url: "https://github.com/SubstrateGaming/", label: "polkadot.network" }
  },
  {
    x: 0.605, y: 0.872, colorClass: 'dot-color-green', radius: 5,
    title: "FRAME",
    text: {
    en: "With Polkadot SDK’s FRAME (Framework for Runtime Aggregation of Modularized Entities), developers gain access to a powerful suite of tools for building custom blockchain runtimes. FRAME offers a modular architecture, featuring reusable pallets and support libraries, to streamline development.",
    es: "Con FRAME (Framework for Runtime Aggregation of Modularized Entities) del SDK de Polkadot, los desarrolladores obtienen acceso a un potente conjunto de herramientas para construir runtimes de blockchain personalizados. FRAME ofrece una arquitectura modular, con pallets reutilizables y bibliotecas de soporte, para agilizar el desarrollo.",
    pt: "Com o FRAME (Framework for Runtime Aggregation of Modularized Entities) do SDK Polkadot, os desenvolvedores ganham acesso a um poderoso conjunto de ferramentas para criar runtimes de blockchain personalizados. O FRAME oferece uma arquitetura modular, com pallets reutilizáveis e bibliotecas de suporte, para simplificar o desenvolvimento.",
    fr: "Avec FRAME (Framework for Runtime Aggregation of Modularized Entities) du SDK Polkadot, les développeurs bénéficient d'une suite puissante d'outils pour construire des runtimes blockchain personnalisés. FRAME propose une architecture modulaire, avec des palettes réutilisables et des bibliothèques de support, pour rationaliser le développement.",
    de: "Mit FRAME (Framework for Runtime Aggregation of Modularized Entities) des Polkadot-SDK erhalten Entwickler Zugang zu einer leistungsstarken Tool-Suite für den Bau benutzerdefinierter Blockchain-Runtimes. FRAME bietet eine modulare Architektur mit wiederverwendbaren Pallets und Support-Bibliotheken zur Entwicklungsvereinfachung.",
    af: "Met Polkadot SDK se FRAME (Framework for Runtime Aggregation of Modularized Entities) kry ontwikkelaars toegang tot 'n kragtige stel gereedskap vir die bou van pasgemaakte blockchain-runtimes. FRAME bied 'n modulêre argitektuur met herbruikbare pallette en ondersteuningsbiblioteke om ontwikkeling te stroomlyn.",
    zh: "通过Polkadot SDK的FRAME（模块化实体运行时聚合框架），开发者可以获得构建自定义区块链运行时的强大工具套件。FRAME提供模块化架构，具有可复用的功能模块和支持库，以简化开发流程。",
    hi: "पोल्काडॉट एसडीके के FRAME (Framework for Runtime Aggregation of Modularized Entities) के साथ, डेवलपर्स को कस्टम ब्लॉकचेन रनटाइम्स बनाने के लिए एक शक्तिशाली टूल सूट तक पहुंच प्राप्त होती है। FRAME एक मॉड्यूलर आर्किटेक्चर प्रदान करता है, जिसमें पुन: प्रयोज्य पैलेट्स और सपोर्ट लाइब्रेरीज़ शामिल हैं, जो विकास को सुव्यवस्थित करते हैं।"

    },
    source: { icon: "◎", type: "Rust", url: "https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/polkadot_sdk/frame_runtime/index.html", label: "polkadot.network" }
  },
  {
    x: 0.613, y: 0.888, colorClass: 'dot-color-green', radius: 5,
    title: "Pallets",
    text: {
    en: "Pallets are modular components within the FRAME ecosystem that encapsulate specific blockchain functionalities. These modules offer customizable business logic for various use cases and features that can be integrated into a runtime.",
    es: "Los Pallets son componentes modulares dentro del ecosistema FRAME que encapsulan funcionalidades específicas de blockchain. Estos módulos ofrecen lógica de negocio personalizable para diversos casos de uso y características que pueden integrarse en un runtime.",
    pt: "Pallets são componentes modulares dentro do ecossistema FRAME que encapsulam funcionalidades específicas de blockchain. Esses módulos oferecem lógica de negócios personalizável para vários casos de uso e recursos que podem ser integrados a um runtime.",
    fr: "Les Pallets sont des composants modulaires au sein de l'écosystème FRAME qui encapsulent des fonctionnalités blockchain spécifiques. Ces modules offrent une logique métier personnalisable pour divers cas d'usage et fonctionnalités pouvant être intégrées à un runtime.",
    de: "Pallets sind modulare Komponenten innerhalb des FRAME-Ökosystems, die spezifische Blockchain-Funktionalitäten kapseln. Diese Module bieten anpassbare Geschäftslogik für verschiedene Anwendungsfälle und Funktionen, die in einen Runtime integriert werden können.",
    af: "Pallets is modulêre komponente binne die FRAME-ekosisteem wat spesifieke blokkettingfunksies inkapsuleer. Hierdie modules bied aanpasbare besigheidslogika vir verskeie gebruiksgevalle en funksies wat in 'n runtime geïntegreer kan word.",
    zh: "Pallets是FRAME生态系统中的模块化组件，封装了特定的区块链功能。这些模块为各种用例和功能提供可定制的业务逻辑，并可集成到运行时中。",
    hi: "पैलेट्स FRAME इकोसिस्टम के भीतर मॉड्यूलर कंपोनेंट्स हैं जो विशिष्ट ब्लॉकचेन कार्यक्षमताओं को समाहित करते हैं। ये मॉड्यूल विभिन्न उपयोग मामलों और सुविधाओं के लिए अनुकूलन योग्य बिजनेस लॉजिक प्रदान करते हैं जिन्हें एक रनटाइम में एकीकृत किया जा सकता है।"

    },
    source: { icon: "◎", type: "TBD", url: "https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/polkadot_sdk/frame_runtime/index.html#pallets", label: "polkadot.network" }
  },
  {
    x: 0.625, y: 0.635, colorClass: 'dot-color-green', radius: 7,
    title: "Substrate",
    text: {
    en: "Substrate is a Software Development Kit (SDK) that uses Rust-based libraries and tools to enable you to build application-specific blockchains from modular and extensible components. Application-specific blockchains built with Substrate can run as standalone services or in parallel with other chains to take advantage of the shared security provided by the Polkadot ecosystem.",
    es: "Substrate es un Kit de Desarrollo de Software (SDK) que utiliza bibliotecas y herramientas basadas en Rust para permitirte construir blockchains específicas para aplicaciones a partir de componentes modulares y extensibles. Las blockchains específicas para aplicaciones construidas con Substrate pueden ejecutarse como servicios independientes o en paralelo con otras cadenas para aprovechar la seguridad compartida proporcionada por el ecosistema Polkadot.",
    pt: "Substrate é um Kit de Desenvolvimento de Software (SDK) que utiliza bibliotecas e ferramentas baseadas em Rust para permitir a construção de blockchains específicas para aplicações a partir de componentes modulares e extensíveis. Blockchains específicas para aplicações construídas com Substrate podem operar como serviços independentes ou em paralelo com outras cadeias para aproveitar a segurança compartilhada fornecida pelo ecossistema Polkadot.",
    fr: "Substrate est un Kit de Développement Logiciel (SDK) utilisant des bibliothèques et outils basés sur Rust pour vous permettre de construire des blockchains spécifiques à des applications à partir de composants modulaires et extensibles. Les blockchains spécifiques aux applications construites avec Substrate peuvent fonctionner comme des services autonomes ou en parallèle avec d'autres chaînes pour bénéficier de la sécurité partagée fournie par l'écosystème Polkadot.",
    de: "Substrate ist ein Software Development Kit (SDK), das Rust-basierte Bibliotheken und Tools verwendet, um Ihnen den Bau anwendungsspezifischer Blockchains aus modularen und erweiterbaren Komponenten zu ermöglichen. Mit Substrate gebaute anwendungsspezifische Blockchains können als eigenständige Dienste oder parallel zu anderen Chains laufen, um die durch das Polkadot-Ökosystem bereitgestellte gemeinsame Sicherheit zu nutzen.",
    af: "Substrate is 'n Sagteware-ontwikkelingspakket (SDK) wat Rust-gebaseerde biblioteke en gereedskap gebruik om jou in staat te stel om toepassingspesifieke blokkettinge te bou van modulêre en uitbreidbare komponente. Toepassingspesifieke blokkettinge gebou met Substrate kan as selfstandige dienste of parallel met ander kettings loop om voordeel te trek uit die gedeelde sekuriteit wat deur die Polkadot-ekosisteem verskaf word.",
    zh: "Substrate是一个软件开发工具包(SDK)，它使用基于Rust的库和工具，使您能够从模块化和可扩展的组件构建特定于应用的区块链。使用Substrate构建的特定应用区块链可以作为独立服务运行，或与其他链并行运行，以利用Polkadot生态系统提供的共享安全性。",
    hi: "सब्सट्रेट एक सॉफ्टवेयर डेवलपमेंट किट (SDK) है जो रस्ट-आधारित लाइब्रेरीज़ और टूल्स का उपयोग करके आपको मॉड्यूलर और एक्स्टेंसिबल कंपोनेंट्स से एप्लिकेशन-स्पेसिफिक ब्लॉकचेन बनाने में सक्षम बनाता है। सब्सट्रेट से निर्मित एप्लिकेशन-स्पेसिफिक ब्लॉकचेन स्टैंडअलोन सेवाओं के रूप में या अन्य चेन्स के साथ समानांतर रूप से चल सकती हैं, जिससे पोल्काडॉट इकोसिस्टम द्वारा प्रदान की गई साझा सुरक्षा का लाभ मिलता है।"

    },
    source: { icon: "◎", type: "Rust", url: "https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/polkadot_sdk/substrate/index.html", label: "polkadot.network" }
  },
  {
    x: 0.693, y: 0.688, colorClass: 'dot-color-green', radius: 5,
    title: "Solidity",
    text: {
    en: "Moonbeam uses unified accounts, meaning an H160 (Ethereum-style) address is also a valid Substrate address, so you only need a single account to interact with the Substrate runtime and the EVM. Once a balance exists in the EVM, smart contracts can be created and interacted with through standard Ethereum RPC calls.",
    es: "Moonbeam utiliza cuentas unificadas, lo que significa que una dirección H160 (estilo Ethereum) también es una dirección Substrate válida, por lo que solo necesitas una única cuenta para interactuar con el runtime de Substrate y la EVM. Una vez que existe un saldo en la EVM, se pueden crear e interactuar con contratos inteligentes mediante llamadas RPC estándar de Ethereum.",
    pt: "Moonbeam utiliza contas unificadas, significando que um endereço H160 (estilo Ethereum) também é um endereço Substrate válido, portanto você só precisa de uma única conta para interagir com o runtime Substrate e a EVM. Uma vez que exista um saldo na EVM, contratos inteligentes podem ser criados e acessados através de chamadas RPC padrão do Ethereum.",
    fr: "Moonbeam utilise des comptes unifiés, ce qui signifie qu'une adresse H160 (type Ethereum) est également une adresse Substrate valide. Ainsi, vous n'avez besoin que d'un seul compte pour interagir avec le runtime Substrate et l'EVM. Une fois qu'un solde existe dans l'EVM, des contrats intelligents peuvent être créés et utilisés via des appels RPC Ethereum standard.",
    de: "Moonbeam verwendet vereinheitlichte Konten, was bedeutet, dass eine H160-Adresse (Ethereum-Stil) auch eine gültige Substrate-Adresse ist. Daher benötigen Sie nur ein einzelnes Konto, um mit der Substrate-Runtime und der EVM zu interagieren. Sobald ein Guthaben in der EVM existiert, können Smart Contracts über standardmäßige Ethereum-RPC-Aufrufe erstellt und genutzt werden.",
    af: "Moonbeam gebruik verenigde rekeninge, wat beteken dat 'n H160 (Ethereum-styl) adres ook 'n geldige Substrate-adres is, sodat jy slegs een rekening nodig het om met die Substrate-runtime en die EVM te interaksie. Sodra 'n saldo in die EVM bestaan, kan slimkontrakte geskep en daarmee gekommunikeer word deur middel van standaard Ethereum RPC-oproepe.",
    zh: "Moonbeam使用统一账户，意味着H160（以太坊风格）地址同时也是有效的Substrate地址，因此您只需要一个账户即可与Substrate运行时和EVM交互。一旦EVM中存在余额，就可以通过标准的以太坊RPC调用来创建和交互智能合约。",
    hi: "मूनबीम यूनिफाइड अकाउंट्स का उपयोग करता है, जिसका अर्थ है कि एक H160 (इथेरियम-स्टाइल) एड्रेस एक वैध सब्सट्रेट एड्रेस भी है, इसलिए आपको सब्सट्रेट रनटाइम और EVM के साथ इंटरैक्ट करने के लिए केवल एक ही अकाउंट की आवश्यकता होती है। एक बार EVM में बैलेंस मौजूद होने पर, स्टैंडर्ड इथेरियम RPC कॉल के माध्यम से स्मार्ट कॉन्ट्रैक्ट्स बनाए और उनके साथ इंटरैक्ट किया जा सकता है।"

    },
    source: { icon: "◎", type: "Solidity", url: "https://docs.moonbeam.network/builders/ethereum/dev-env/", label: "polkadot.network" }
  },
  {
    x: 0.693, y: 0.665, colorClass: 'dot-color-green', radius: 5,
    title: "wasm",
    text: {
    en: "Wasm allows developers to write smart contracts in multiple programming languages. This opens up the platform to a broader developer community, enabling them to use languages they are already familiar with, like Rust and C++",
    es: "Wasm permite a los desarrolladores escribir contratos inteligentes en múltiples lenguajes de programación. Esto abre la plataforma a una comunidad más amplia de desarrolladores, permitiéndoles usar lenguajes que ya conocen, como Rust y C++.",
    pt: "Wasm permite que desenvolvedores escrevam contratos inteligentes em várias linguagens de programação. Isso abre a plataforma para uma comunidade mais ampla de desenvolvedores, permitindo que usem linguagens que já conhecem, como Rust e C++.",
    fr: "Wasm permet aux développeurs d'écrire des contrats intelligents dans plusieurs langages de programation. Cela ouvre la plateforme à une communauté plus large de développeurs, leur permettant d'utiliser des langages qu'ils connaissent déjà, comme Rust et C++.",
    de: "Wasm ermöglicht Entwicklern, Smart Contracts in mehreren Programmiersprachen zu schreiben. Dies öffnet die Plattform für eine breitere Entwicklergemeinschaft und ermöglicht ihnen die Verwendung bereits bekannter Sprachen wie Rust und C++.",
    af: "Wasm laat ontwikkelaars toe om slimkontrakte in verskeie programmeertale te skryf. Dit maak die platform toeganklik vir 'n breër ontwikkelingsgemeenskap en stel hulle in staat om tale wat hulle reeds ken, soos Rust en C++, te gebruik.",
    zh: "Wasm允许开发者使用多种编程语言编写智能合约。这为更广泛的开发者社区开放了平台，使他们能够使用已经熟悉的语言，如Rust和C++。",
    hi: "Wasm डेवलपर्स को कई प्रोग्रामिंग भाषाओं में स्मार्ट कॉन्ट्रैक्ट्स लिखने की सुविधा देता है। यह प्लेटफॉर्म को एक व्यापक डेवलपर कम्युनिटी के लिए खोलता है, जिससे वे पहले से परिचित भाषाओं जैसे Rust और C++ का उपयोग कर सकते हैं।"

    },
    source: { icon: "◎", type: "Rust, C++, WebAssembly", url: "https://docs.astar.network/docs/build/wasm/smart-contract-wasm/", label: "polkadot.network" }
  },
  {
    x: 0.716, y: 0.665, colorClass: 'dot-color-green', radius: 5,
    title: "ink!",
    text: {
    en: "ink! is a programming language for smart contracts — one of several that blockchains built with the Substrate framework can choose from. It’s an opinionated language that we at Parity have built by extending the popular Rust programming language with functionality needed to make it smart contract compatible.",
    es: "ink! es un lenguaje de programación para contratos inteligentes — uno de los varios que pueden elegir las blockchains construidas con el framework Substrate. Es un lenguaje con enfoque definido que hemos construido en Parity extendiendo el popular lenguaje de programación Rust con la funcionalidad necesaria para hacerlo compatible con contratos inteligentes.",
    pt: "ink! é uma linguagem de programação para contratos inteligentes — uma das várias que blockchains construídas com o framework Substrate podem escolher. É uma linguagem com opiniões definidas que nós da Parity construímos estendendo a popular linguagem de programação Rust com a funcionalidade necessária para torná-la compatível com contratos inteligentes.",
    fr: "ink! est un langage de programmation pour contrats intelligents — l'un des nombreux que les blockchains construites avec le framework Substrate peuvent choisir. C'est un langage orienté que nous avons construit chez Parity en étendant le populaire langage de programmation Rust avec les fonctionnalités nécessaires pour le rendre compatible avec les smart contracts.",
    de: "ink! ist eine Programmiersprache für Smart Contracts — eine von mehreren, die Blockchains mit dem Substrate-Framework verwenden können. Es ist eine opinionated Sprache, die wir bei Parity entwickelt haben, indem wir die beliebte Programmiersprache Rust um die für Smart Contracts erforderliche Funktionalität erweitert haben.",
    af: "ink! is 'n programmeertaal vir slimkontrakte — een van verskeie wat blockchains gebou met die Substrate-raamwerk kan kies. Dit is 'n opinionated taal wat ons by Parity gebou het deur die gewilde programmeertaal Rust uit te brei met die funksionaliteit wat nodig is om dit slimkontrak-verenigbaar te maak.",
    zh: "ink!是一种智能合约编程语言——基于Substrate框架构建的区块链可以选择的几种语言之一。它是一种有明确设计理念的语言，我们Parity通过扩展流行的Rust编程语言，添加了使其兼容智能合约所需的功能。",
    hi: "ink! स्मार्ट कॉन्ट्रैक्ट्स के लिए एक प्रोग्रामिंग भाषा है — सब्सट्रेट फ्रेमवर्क से निर्मित ब्लॉकचेन्स के लिए उपलब्ध कई विकल्पों में से एक। यह एक निश्चित दृष्टिकोण वाली भाषा है जिसे हमने पैरिटी में लोकप्रिय रस्ट प्रोग्रामिंग भाषा को स्मार्ट कॉन्ट्रैक्ट संगत बनाने के लिए आवश्यक कार्यक्षमता के साथ विस्तारित करके बनाया है।"

    },
    source: { icon: "◎", type: "Rust", url: "https://github.com/use-ink/ink", label: "polkadot.network" }
  },
  {
    x: 0.716, y: 0.688, colorClass: 'dot-color-green', radius: 5,
    title: "ask!",
    text: {
    en: "Ask! is a framework for AssemblyScript developers to write WASM smart contracts on Substrate FRAME pallet-contracts.",
    es: "Ask! es un framework para desarrolladores AssemblyScript que permite escribir contratos inteligentes WASM en el pallet-contracts de Substrate FRAME.",
    pt: "Ask! é um framework para desenvolvedores AssemblyScript escreverem contratos inteligentes WASM no pallet-contracts do Substrate FRAME.",
    fr: "Ask! est un framework permettant aux développeurs AssemblyScript d'écrire des contrats intelligents WASM sur le pallet-contracts de Substrate FRAME.",
    de: "Ask! ist ein Framework für AssemblyScript-Entwickler, um WASM-Smart-Contracts auf dem Substrate FRAME pallet-contracts zu schreiben.",
    af: "Ask! is 'n raamwerk vir AssemblyScript-ontwikkelaars om WASM-slimkontrakte op Substrate FRAME se pallet-contracts te skryf.",
    zh: "Ask! 是一个供AssemblyScript开发者使用的框架，用于在Substrate FRAME的pallet-contracts上编写WASM智能合约。",
    hi: "Ask! एक फ्रेमवर्क है जो AssemblyScript डेवलपर्स को Substrate FRAME के pallet-contracts पर WASM स्मार्ट कॉन्ट्रैक्ट्स लिखने की सुविधा प्रदान करता है।"

    },
    source: { icon: "◎", type: "TypeScript", url: "https://github.com/ask-lang/ask", label: "polkadot.network" }
  },
  {
    x: 0.758, y: 0.688, colorClass: 'dot-color-green', radius: 5,
    title: "Solang",
    text: {
    en: "Solang, a new Solidity compiler written in rust which uses llvm as the compiler backend. Solang can compile Solidity for Solana and Polkadot Parachains with the contracts pallet",
    es: "Solang, un nuevo compilador de Solidity escrito en Rust que utiliza LLVM como backend de compilación. Solang puede compilar Solidity para Solana y parachains de Polkadot con el pallet contracts.",
    pt: "Solang, um novo compilador Solidity escrito em Rust que utiliza LLVM como backend de compilação. Solang pode compilar Solidity para Solana e parachains da Polkadot com o pallet contracts.",
    fr: "Solang, un nouveau compilateur Solidity écrit en Rust utilisant LLVM comme backend de compilation. Solang peut compiler Solidity pour Solana et les parachains Polkadot avec le pallet contracts.",
    de: "Solang, ein neuer in Rust geschriebener Solidity-Compiler, der LLVM als Compiler-Backend nutzt. Solang kann Solidity für Solana und Polkadot-Parachains mit dem Contracts-Pallet kompilieren.",
    af: "Solang, 'n nuwe Solidity-samesteller geskryf in Rust wat LLVM as samesteller-agterkant gebruik. Solang kan Solidity saamstel vir Solana en Polkadot-parachains met die contracts-pallet.",
    zh: "Solang是一个用Rust编写的新Solidity编译器，使用LLVM作为编译器后端。Solang可以为Solana和具有contracts pallet的Polkadot平行链编译Solidity。",
    hi: "सोलैंग, रस्ट में लिखा गया एक नया सॉलिडिटी कंपाइलर जो LLVM को कंपाइलर बैकएंड के रूप में उपयोग करता है। सोलैंग सोलाना और contracts पैलेट वाले पोल्काडॉट पैराचेन्स के लिए सॉलिडिटी को कंपाइल कर सकता है।"

    },
    source: { icon: "◎", type: "TBD", url: "https://github.com/hyperledger-solang/solang", label: "polkadot.network" }
  },
  {
    x: 0.74, y: 0.665, colorClass: 'dot-color-green', radius: 5,
    title: "Pop",
    text: {
    en: "Pop is a development platform for Web3 applications on Polkadot. It provides the necessary tooling and infrastructure to build, test, and deploy your decentralized applications ",
    es: "Pop es una plataforma de desarrollo para aplicaciones Web3 en Polkadot. Proporciona las herramientas e infraestructura necesarias para construir, probar e implementar tus aplicaciones descentralizadas.",
    pt: "Pop é uma plataforma de desenvolvimento para aplicações Web3 na Polkadot. Ela fornece as ferramentas e infraestrutura necessárias para construir, testar e implantar suas aplicações descentralizadas.",
    fr: "Pop est une plateforme de développement pour applications Web3 sur Polkadot. Il fournit les outils et l'infrastructure nécessaires pour construire, tester et déployer vos applications décentralisées.",
    de: "Pop ist eine Entwicklungsplattform für Web3-Anwendungen auf Polkadot. Sie bietet die notwendigen Tools und die Infrastruktur zum Erstellen, Testen und Bereitstellen dezentraler Anwendungen.",
    af: "Pop is 'n ontwikkelingsplatform vir Web3-toepassings op Polkadot. Dit verskaf die nodige gereedskap en infrastruktuur om jou gedesentraliseerde toepassings te bou, toets en implementeer.",
    zh: "Pop是Polkadot上的Web3应用开发平台。它提供了构建、测试和部署去中心化应用所需的工具和基础设施。",
    hi: "पॉप, पोल्काडॉट पर वेब3 एप्लिकेशन्स के लिए एक डेवलपमेंट प्लेटफॉर्म है। यह आपके डिसेंट्रलाइज्ड एप्लिकेशन्स को बनाने, टेस्ट करने और डिप्लॉय करने के लिए आवश्यक टूल्स और इंफ्रास्ट्रक्चर प्रदान करता है।"

    },
    source: { icon: "◎", type: "Rust", url: "https://onpop.io/", label: "polkadot.network" }
  },
  {
    x: 0.774, y: 0.665, colorClass: 'dot-color-green', radius: 5,
    title: "Move",
    text: {
    en: "Smart contracts can directly be implemented and executed as Move scripts or modularized in Move modules. Therefor, the pallet supports publishing of Move modules and the execution of Move scripts to achieve this functionality.",
    es: "Los contratos inteligentes pueden implementarse y ejecutarse directamente como scripts Move o modularizarse en módulos Move. Por lo tanto, el pallet admite la publicación de módulos Move y la ejecución de scripts Move para lograr esta funcionalidad.",
    pt: "Os contratos inteligentes podem ser implementados e executados diretamente como scripts Move ou modularizados em módulos Move. Para isso, o pallet suporta a publicação de módulos Move e a execução de scripts Move para alcançar essa funcionalidade.",
    fr: "Les contrats intelligents peuvent être implémentés et exécutés directement sous forme de scripts Move ou modularisés dans des modules Move. Ainsi, le pallet prend en charge la publication de modules Move et l'exécution de scripts Move pour réaliser cette fonctionnalité.",
    de: "Smart Contracts können direkt als Move-Skripte implementiert und ausgeführt oder in Move-Modulen modularisiert werden. Daher unterstützt das Pallet die Veröffentlichung von Move-Modulen und die Ausführung von Move-Skripten, um diese Funktionalität zu ermöglichen.",
    af: "Slimkontrakte kan direk geïmplementeer en uitgevoer word as Move-skrips of gemodulariseer word in Move-modules. Die pallet ondersteun dus die publikasie van Move-modules en die uitvoering van Move-skrips om hierdie funksionaliteit te bereik.",
    zh: "智能合约可以直接作为Move脚本实现和执行，或模块化为Move模块。因此，该功能模块支持发布Move模块和执行Move脚本来实现此功能。",
    hi: "स्मार्ट कॉन्ट्रैक्ट्स को सीधे Move स्क्रिप्ट्स के रूप में लागू और निष्पादित किया जा सकता है या Move मॉड्यूल्स में मॉड्यूलराइज़ किया जा सकता है। इसलिए, यह पैलेट Move मॉड्यूल्स के प्रकाशन और Move स्क्रिप्ट्स के निष्पादन को सपोर्ट करता है ताकि यह कार्यक्षमता प्राप्त की जा सके।"

    },
    source: { icon: "◎", type: "TBD", url: "https://github.com/eigerco/pallet-move", label: "polkadot.network" }
  },
  {
    x: 0.712, y: 0.768, colorClass: 'dot-color-green', radius: 5,
    title: "Unity client",
    text: {
    en: "Official Polkadot SDK for Unity: Elevate your projects with effortless blockchain integration for dynamic gaming and unseen web3 app development",
    es: "SDK oficial de Polkadot para Unity: Eleva tus proyectos con una integración blockchain sin esfuerzo para desarrollo de juegos dinámicos y aplicaciones web3 innovadoras.",
    pt: "SDK oficial da Polkadot para Unity: Eleve seus projetos com integração blockchain sem esforço para desenvolvimento de jogos dinâmicos e aplicativos web3 inéditos.",
    fr: "SDK officiel Polkadot pour Unity : Élevez vos projets avec une intégration blockchain simplissime pour des jeux dynamiques et un développement d'applications web3 inédit.",
    de: "Offizielles Polkadot SDK für Unity: Heben Sie Ihre Projekte mit müheloser Blockchain-Integration auf ein neues Level für dynamische Spiele und einzigartige Web3-App-Entwicklung.",
    af: "Amptelike Polkadot SDK vir Unity: Verhoog jou projekte met moeitelose blokketting-integrasie vir dinamiese speletjie-ontwikkeling en ongekende web3-toepassing-ontwikkeling.",
    zh: "通过轻松实现区块链集成，为动态游戏和前所未有的Web3应用开发提升您的项目。",
    hi: "यूनिटी के लिए आधिकारिक पोल्काडॉट एसडीके: डायनामिक गेमिंग और अद्वितीय वेब3 ऐप डेवलपमेंट के लिए सहज ब्लॉकचेन एकीकरण के साथ अपने प्रोजेक्ट्स को उन्नत बनाएं।"

    },
    source: { icon: "◎", type: "C#", url: "https://assetstore.unity.com/packages/decentralization/infrastructure/polkadot-sdk-for-unity-273535", label: "polkadot.network" }
  },
  {
    x: 0.545, y: 0.533, colorClass: 'dot-color-green', radius: 7,
    title: "Polkadot sdk",
    text: {
    en: "The Polkadot SDK is a powerful and versatile developer kit designed to facilitate building on the Polkadot network. It provides the necessary components for creating custom blockchains, parachains, generalized rollups, and more. Written in the Rust programming language, it puts security and robustness at the forefront of its design.",
    es: "El SDK de Polkadot es un kit de desarrollo potente y versátil diseñado para facilitar la construcción en la red Polkadot. Proporciona los componentes necesarios para crear blockchains personalizadas, parachains, rollups generalizados y más. Escrito en el lenguaje de programación Rust, prioriza la seguridad y robustez en su diseño.",
    pt: "O SDK da Polkadot é um kit de desenvolvimento poderoso e versátil projetado para facilitar a construção na rede Polkadot. Ele fornece os componentes necessários para criar blockchains personalizadas, parachains, rollups generalizados e mais. Escrito na linguagem de programação Rust, coloca a segurança e robustez no centro de seu design.",
    fr: "Le SDK Polkadot est une boîte à outils de développement puissante et polyvalente conçue pour faciliter la construction sur le réseau Polkadot. Il fournit les composants nécessaires pour créer des blockchains personnalisées, des parachains, des rollups généralisés et plus encore. Écrit en langage de programmation Rust, il place la sécurité et la robustesse au cœur de sa conception.",
    de: "Das Polkadot SDK ist ein leistungsstarkes und vielseitiges Entwicklerkit, das für die Entwicklung im Polkadot-Netzwerk konzipiert ist. Es bietet die notwendigen Komponenten zur Erstellung benutzerdefinierter Blockchains, Parachains, generalisierter Rollups und mehr. In der Programmiersprache Rust geschrieben, stehen Sicherheit und Robustheit im Mittelpunkt seines Designs.",
    af: "Die Polkadot SDK is 'n kragtige en veelsydige ontwikkelingspakket wat ontwerp is om bou op die Polkadot-netwerk te vergemaklik. Dit verskaf die nodige komponente om pasgemaakte blokkettinge, parachains, veralgemeende rollups en meer te skep. Geskryf in die Rust-programmeertaal, plaas dit sekuriteit en robuustheid aan die voorpunt van sy ontwerp.",
    zh: "Polkadot SDK是一个功能强大且多功能的开发工具包，旨在简化Polkadot网络上的开发工作。它提供了创建自定义区块链、平行链、通用rollup等所需的所有组件。采用Rust编程语言编写，其设计将安全性和稳健性放在首位。",
    hi: "पोल्काडॉट एसडीके एक शक्तिशाली और बहुमुखी डेवलपर किट है जिसे पोल्काडॉट नेटवर्क पर निर्माण को सुगम बनाने के लिए डिज़ाइन किया गया है। यह कस्टम ब्लॉकचेन, पैराचेन्स, सामान्यीकृत रोलअप्स और अन्य चीज़ों के निर्माण के लिए आवश्यक घटक प्रदान करता है। रस्ट प्रोग्रामिंग भाषा में लिखा गया, यह सुरक्षा और मजबूती को अपने डिज़ाइन के केंद्र में रखता है।"

    },
    source: { icon: "◎", type: "Rust", url: "https://github.com/paritytech/polkadot-sdk", label: "polkadot.network" }
  }
];

// Create and position all dots dynamically in the DOM
const dots = [];

dotsData.forEach((dot, idx) => {
  const el = document.createElement('div');
  el.className = `dot ${dot.colorClass}`;
  el.dataset.idx = idx;
  el.style.width = el.style.height = `${dot.radius * 2}px`;
  zoomable.appendChild(el);
  dots.push(el);

  // Creamos una nueva función para cada punto que usa "el" directamente
  el.addEventListener('click', (e) => {
    e.stopPropagation();

    const rect = el.getBoundingClientRect(); // ✅ Usamos "el", no dotElement
    
    tooltipContent.innerHTML = `
      <h3>${dot.title}</h3>
      <p>${dot.text}</p>
      <small>
        <span class="language-icon">${dot.source.icon}</span> ${dot.source.type} |
        <a href="${dot.source.url}" target="_blank" style="color:#4dabf7;">${dot.source.label}</a>
      </small>
    `;

    tooltip.style.left = `${rect.left + 20}px`;
    tooltip.style.top = `${rect.top + 20}px`;
    tooltip.style.display = 'block';
  });
});

// Close tooltip when clicking the close button
closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  tooltip.style.display = 'none';
});

// Close tooltip when clicking outside of it or any dot
window.addEventListener('click', (e) => {
  if (!tooltip.contains(e.target) && !e.target.classList.contains('dot')) {
    tooltip.style.display = 'none';
  }
});

// Close tooltip with Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') tooltip.style.display = 'none';
});

// Adjust dot positions based on the current image size
function positionDots() {
  const imgW = image.offsetWidth;
  const imgH = image.offsetHeight;

  dotsData.forEach((dot, idx) => {
    dots[idx].style.left = `${imgW * dot.x}px`;
    dots[idx].style.top = `${imgH * dot.y}px`;
  });
}

// Apply zoom transformation while keeping center point fixed
function applyZoom(newScale) {
  newScale = Math.max(minScale, Math.min(maxScale, newScale)); // Clamp scale between min and max
  const scaleRatio = newScale / currentScale;

  // Get current scroll position and center coordinates
  const scrollLeft = wrapper.scrollLeft;
  const scrollTop = wrapper.scrollTop;
  const centerX = scrollLeft + wrapper.clientWidth / 2;
  const centerY = scrollTop + wrapper.clientHeight / 2;

  // Update scale and transform
  currentScale = newScale;
  zoomContainer.style.transform = `scale(${currentScale})`;

  // Recalculate center after scaling and adjust scroll position
  const newCenterX = centerX * scaleRatio;
  const newCenterY = centerY * scaleRatio;

  wrapper.scrollLeft = newCenterX - wrapper.clientWidth / 2;
  wrapper.scrollTop = newCenterY - wrapper.clientHeight / 2;

  positionDots(); // Re-position dots after zoom
}

// Event listeners for zoom buttons
document.getElementById('zoom-in').addEventListener('click', () => {
  applyZoom(currentScale + 0.2);
});
document.getElementById('zoom-out').addEventListener('click', () => {
  applyZoom(currentScale - 0.2);
});

// On page load: hide tooltip and center the map
window.onload = () => {
  positionDots();
  tooltip.style.display = 'none';

  setTimeout(() => {
    wrapper.scrollLeft = (zoomable.clientWidth - wrapper.clientWidth) / 2;
    wrapper.scrollTop = (zoomable.clientHeight - wrapper.clientHeight) / 2;
  }, 100);
  const savedLang = localStorage.getItem('appLang') || 'en';
  initLanguageButtons(); // Marca el idioma guardado
  updateAllTooltips(savedLang);
  initLanguage(); // Esto reasigna los eventos con el idioma guardado
  
};

// Reposition dots when window resizes or image finishes loading
window.onresize = positionDots;
image.onload = positionDots;

// Call positionDots immediately if image was cached
if (image.complete) positionDots();

// Optional JavaScript to close the popup
  document.getElementById('close-popup').addEventListener('click', function () {
    const popup = document.getElementById('popup-notification');
    popup.style.display = 'none';
  });


