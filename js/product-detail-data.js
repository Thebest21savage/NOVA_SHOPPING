const notes = {
  1: {
    brand:"NOVA Audio Edit", bestFor:"Listeners looking for wireless everyday audio with a noise-canceling focus.", standout:"Noise cancellation is the clearest differentiator in this sample listing.", beforeBuy:"Battery life, codec support, and fit details need confirmation before a real purchase.",
    bestForList:["Daily listening at home or on the commute","People who want background noise reduction"], considerList:["You need confirmed battery or codec specifications","A compact on-ear fit matters more than isolation"],
    loved:["Noise-canceling focus","Wireless everyday use","Clear product positioning"], concerns:["Battery details not listed","Fit and accessory information missing"],
    alternatives:[{id:11,label:"Best value",reason:"A lower-priced option for room-filling audio."},{id:5,label:"Feature-rich",reason:"A wearable tech pick for activity tracking."},{id:6,label:"Travel friendly",reason:"A simple everyday essential at a lower price."}],
    accessories:[{id:11,reason:"A portable speaker gives you a different listening setup at home."},{id:6,reason:"A travel bottle is a practical companion for longer commutes."}],
    variants:{label:"Finish",values:["Graphite","Cloud","Sand"]},
    specs:[{label:"Listing highlights",value:"Wireless audio · noise cancellation",meaning:"The catalog positions this as a wireless listening product with noise control.",why:"Check fit, battery, and device compatibility details before deciding."},{label:"Category",value:"Electronics",meaning:"A personal audio product in the sample catalog.",why:"Compare comfort and daily-use features alongside price."}]
  },
  2: {
    brand:"NOVA Home Edit", bestFor:"A reading corner, bedside table, or smaller space that needs a focused light source.", standout:"A ceramic table-lamp silhouette with a simple, considered look.", beforeBuy:"Bulb type, brightness, dimming, and exact dimensions are not included in this sample listing.",
    bestForList:["Adding a lamp to a desk or side table","A calm, minimal home accent"], considerList:["You need confirmed dimming or smart-home support","Your space needs a floor lamp or wide-area lighting"],
    loved:["Simple table-lamp format","Ceramic-led design","Easy-to-place scale"], concerns:["Bulb and dimming details missing","Dimensions need confirmation"],
    alternatives:[{id:8,label:"Cozy home",reason:"A soft furnishing for a room refresh."},{id:12,label:"Natural touch",reason:"A starter set for adding greenery indoors."},{id:7,label:"Reading nook",reason:"A small-format book to pair with a quiet corner."}],
    accessories:[{id:7,reason:"A book can help turn a side table into a comfortable reading spot."},{id:8,reason:"A soft throw adds another layer to a relaxed corner."}],
    variants:{label:"Finish preview",values:["Chalk","Sage","Clay"]},
    specs:[{label:"Listing highlights",value:"Ceramic build · table lamp",meaning:"The sample description calls out a ceramic build and table-lamp use.",why:"Confirm bulb type, brightness, cord length, and dimensions for your room."},{label:"Category",value:"Home",meaning:"A decorative and functional home item.",why:"Think about the surface area and light direction you need."}]
  },
  3: {
    brand:"NOVA Everyday", bestFor:"Casual everyday outfits and low-key plans where a canvas sneaker fits the occasion.", standout:"The listing calls out a canvas upper and an everyday silhouette.", beforeBuy:"Use the retailer's size chart and care instructions when those details are available.",
    bestForList:["Casual daily wear","A simple sneaker to rotate into an existing wardrobe"], considerList:["You need performance or weather-rated footwear","You need a confirmed fit guide or support details"],
    loved:["Everyday style","Canvas-led look","Easy wardrobe pairing"], concerns:["Sizing guide not connected","Care and durability details missing"],
    alternatives:[{id:10,label:"Everyday carry",reason:"A casual backpack for the same daily routine."},{id:6,label:"On the go",reason:"A practical travel essential at a smaller price."},{id:8,label:"At home",reason:"A comfort-first pick for relaxing after a day out."}],
    accessories:[{id:10,reason:"A backpack can make it easier to carry everyday essentials."},{id:6,reason:"A travel bottle is useful for longer days out."}],
    variants:{label:"Size preview",values:["6","7","8","9","10","11"]},
    specs:[{label:"Listing highlights",value:"Canvas upper · everyday sneakers",meaning:"The sample catalog describes a casual canvas style.",why:"Confirm size, materials, and care instructions before buying."},{label:"Category",value:"Fashion",meaning:"A wearable item for casual outfits.",why:"Fit and intended use matter more than the sample rating alone."}]
  },
  4: {
    brand:"NOVA Daily Care", bestFor:"A shopper exploring a straightforward hydrating skincare routine.", standout:"The sample listing groups the products as a daily set.", beforeBuy:"Ingredients, skin-type guidance, and allergy information must be checked before use.",
    bestForList:["People comparing daily skincare sets","A simple starting point for researching a routine"], considerList:["You have ingredient sensitivities or a clinician-directed routine","You need verified ingredient or dermatology information"],
    loved:["Daily-routine format","Hydration focus","Set-based listing"], concerns:["Ingredient list not connected","Skin-type guidance missing"],
    alternatives:[{id:6,label:"Daily routine",reason:"A practical everyday product from another category."},{id:12,label:"Fresh start",reason:"A home-growing set for shoppers exploring a different daily ritual."},{id:2,label:"Home routine",reason:"A small home update rather than a skincare substitute."}],
    accessories:[{id:6,reason:"A reusable bottle is a practical addition to an everyday routine; it is not a skincare accessory."}],
    specs:[{label:"Listing highlights",value:"Hydrating skincare · daily set",meaning:"The sample catalog describes a hydrating set for daily use.",why:"Review the full ingredient list and usage directions before choosing skincare."},{label:"Category",value:"Beauty",meaning:"A personal-care product listing.",why:"Ingredient fit and sensitivities should guide the decision."}]
  },
  5: {
    brand:"NOVA Active Tech", bestFor:"Shoppers who want to compare a smartwatch-style product for fitness-focused routines.", standout:"A wearable format with a fitness focus in the sample description.", beforeBuy:"Phone compatibility, sensor details, battery life, and water rating are not supplied here.",
    bestForList:["People exploring a wearable for active days","Shoppers comparing smart features and price"], considerList:["You need confirmed phone or app compatibility","Specific health sensors or water resistance are essential"],
    loved:["Fitness-led positioning","Wearable format","Simple price comparison"], concerns:["Compatibility details missing","Battery and sensor specifications missing"],
    alternatives:[{id:1,label:"Best performance",reason:"A higher-priced personal-audio pick with a different focus."},{id:11,label:"Best value",reason:"A lower-priced portable audio option."},{id:6,label:"Lightweight pick",reason:"A simple everyday item for active routines."}],
    accessories:[{id:6,reason:"A travel bottle is a useful companion for workouts and active days."},{id:10,reason:"A backpack can carry daily essentials alongside a wearable."}],
    variants:{label:"Band preview",values:["Graphite","Lilac","Sage"]},
    specs:[{label:"Listing highlights",value:"Smart watch · fitness focus",meaning:"The catalog positions this as a fitness-oriented smart watch.",why:"Check app support, phone compatibility, and sensor details before buying."},{label:"Category",value:"Electronics",meaning:"A wearable electronics product.",why:"Compatibility can determine whether the features work for you."}]
  },
  6: {
    brand:"NOVA On The Go", bestFor:"Commuting, errands, and days when an insulated travel bottle is handy.", standout:"An insulated travel format at an accessible sample-catalog price.", beforeBuy:"Capacity, material, leak resistance, and cleaning instructions are not listed yet.",
    bestForList:["Carrying a drink through a busy day","Shoppers comparing practical travel basics"], considerList:["You need a specific capacity or lid style","Dishwasher safety or leak testing is important"],
    loved:["Travel-friendly format","Insulated positioning","Everyday price point"], concerns:["Capacity not specified","Cleaning and lid details missing"],
    alternatives:[{id:10,label:"Carry it along",reason:"An everyday backpack for a different kind of on-the-go essential."},{id:3,label:"Everyday style",reason:"A casual wear option for daily plans."},{id:11,label:"For the road",reason:"A portable listening pick for travel and home."}],
    accessories:[{id:10,reason:"A backpack can make it easy to bring a bottle along for the day."}],
    variants:{label:"Color preview",values:["Stone","Moss","Ink"]},
    specs:[{label:"Listing highlights",value:"Insulated build · travel bottle",meaning:"The sample description calls out insulation and travel use.",why:"Check volume, lid type, and care guidance for your routine."},{label:"Category",value:"Sports",meaning:"A practical item grouped with active and travel products.",why:"Choose a size and closure that suit the way you carry it."}]
  },
  7: {
    brand:"NOVA Reading Room", bestFor:"Readers looking for a short, habit-focused title to explore.", standout:"The title makes its everyday-habits theme clear at a glance.", beforeBuy:"Format, author, publisher, and a complete synopsis are not connected to this sample listing.",
    bestForList:["Readers exploring practical nonfiction","A small gift for someone building a new routine"], considerList:["You need a specific format, author, or edition","You want a detailed preview before deciding"],
    loved:["Clear subject at a glance","Accessible sample price","Easy-to-understand theme"], concerns:["Edition details not listed","No connected reading preview"],
    alternatives:[{id:2,label:"Reading nook",reason:"A table lamp for a comfortable place to read."},{id:8,label:"Settle in",reason:"A soft throw for a relaxed reading corner."},{id:12,label:"Try something new",reason:"An indoor starter set for a different kind of hands-on hobby."}],
    accessories:[{id:2,reason:"A table lamp can help make a comfortable reading corner."},{id:8,reason:"A soft throw is an easy companion for a quiet reading session."}],
    variants:{label:"Format preview",values:["Paperback","Hardcover","Digital"]},
    specs:[{label:"Listing highlights",value:"Reading · everyday habits",meaning:"The sample catalog groups this title around practical habits.",why:"Confirm edition, length, and publisher details when available."},{label:"Category",value:"Books",meaning:"A reading pick in the sample catalog.",why:"A synopsis or preview can help you decide if the subject fits."}]
  },
  8: {
    brand:"NOVA Home Edit", bestFor:"Adding a soft layer to a sofa, chair, or bedroom.", standout:"A knit throw with a comfort-first feel in the sample listing.", beforeBuy:"Fabric blend, dimensions, and washing instructions need confirmation.",
    bestForList:["Refreshing a lounge or bedroom","A cozy, easy-to-style home accent"], considerList:["You need an exact size or material blend","Machine-wash instructions are essential"],
    loved:["Soft knit look","Easy room update","Comfort-first feel"], concerns:["Dimensions not supplied","Care instructions missing"],
    alternatives:[{id:2,label:"Light the space",reason:"A small lamp for a side table or reading corner."},{id:12,label:"Add a natural detail",reason:"A starter set for bringing greenery into the room."},{id:7,label:"Quiet time",reason:"A book to pair with a comfortable space."}],
    accessories:[{id:2,reason:"A table lamp can complement a relaxed seating or reading area."},{id:7,reason:"A book makes an easy pairing for a cozy corner."}],
    variants:{label:"Size preview",values:["Throw","Oversized"]},
    specs:[{label:"Listing highlights",value:"Soft knit · throw blanket",meaning:"The sample description calls out a knit texture and throw format.",why:"Check size, fiber content, and cleaning instructions for your home."},{label:"Category",value:"Home",meaning:"A soft furnishing for living spaces.",why:"Compare dimensions with the seat or bed where you plan to use it."}]
  },
  9: {
    brand:"NOVA Make & Play", bestFor:"A hands-on activity for shoppers exploring creative build kits.", standout:"The sample title combines a build-it activity with a robot theme.", beforeBuy:"Age guidance, small-parts notices, battery needs, and a full parts list need confirmation.",
    bestForList:["Creative play and hands-on building","A gift idea for a curious maker"], considerList:["You need verified age or safety guidance","You want a kit with confirmed parts and instructions"],
    loved:["Build-and-play idea","Creative theme","Giftable format"], concerns:["Age guidance not listed","Parts list and battery needs missing"],
    alternatives:[{id:7,label:"Explore ideas",reason:"A reading pick for a different way to learn and create."},{id:10,label:"Take it along",reason:"An everyday bag for carrying personal projects."},{id:6,label:"For busy days",reason:"A practical travel essential in a different category."}],
    accessories:[{id:7,reason:"A book offers another way to explore creative ideas."}],
    variants:{label:"Build theme preview",values:["Explorer","Inventor","City"]},
    specs:[{label:"Listing highlights",value:"Build-it kit · creative robot",meaning:"The sample catalog describes a robot-themed building activity.",why:"Review age guidance, parts, and instructions before choosing a kit."},{label:"Category",value:"Toys",meaning:"A play and activity product.",why:"Safety and included components matter for the person using it."}]
  },
  10: {
    brand:"NOVA Everyday", bestFor:"Carrying daily essentials for work, study, or short trips.", standout:"A classic everyday backpack format with a simple profile.", beforeBuy:"Capacity, laptop fit, pocket layout, and materials are not supplied in the sample listing.",
    bestForList:["Daily carry for work or study","A simple bag for short trips"], considerList:["You need a specific laptop size or capacity","Weather protection or ergonomic support is a priority"],
    loved:["Everyday carry format","Classic styling","Easy-to-pair look"], concerns:["Capacity not listed","Strap and laptop details missing"],
    alternatives:[{id:3,label:"Wear it out",reason:"A casual sneaker for the same everyday rotation."},{id:6,label:"Travel basic",reason:"A small practical essential for a day out."},{id:1,label:"Commute upgrade",reason:"Personal audio for a different part of the daily routine."}],
    accessories:[{id:6,reason:"A travel bottle is a practical item to bring along in a daily bag."},{id:3,reason:"A casual sneaker rounds out an everyday outfit."}],
    variants:{label:"Color preview",values:["Canvas","Black","Olive"]},
    specs:[{label:"Listing highlights",value:"Everyday carry · backpack",meaning:"The sample catalog describes a general-use backpack.",why:"Confirm dimensions, capacity, and pocket layout for your gear."},{label:"Category",value:"Fashion",meaning:"A wearable carry item for daily use.",why:"Fit, materials, and intended load can make a big difference."}]
  },
  11: {
    brand:"NOVA Audio Edit", bestFor:"Portable listening around the home or on a trip.", standout:"A Bluetooth speaker at a lower sample-catalog price than the headphones.", beforeBuy:"Battery life, audio output, Bluetooth version, and water resistance are not listed.",
    bestForList:["A portable speaker for casual listening","Shoppers comparing approachable audio options"], considerList:["You need high-output or room-specific performance","Battery and water-resistance details are essential"],
    loved:["Portable audio format","Accessible sample price","Easy-to-scan listing"], concerns:["Battery life missing","No sound or water-rating details"],
    alternatives:[{id:1,label:"Best performance",reason:"A premium-priced personal audio option with noise-canceling focus."},{id:5,label:"Wear it",reason:"A wearable tech pick for activity-focused routines."},{id:6,label:"On the go",reason:"A lower-priced practical travel item."}],
    accessories:[{id:6,reason:"A travel bottle is a useful companion for days out with music."},{id:10,reason:"An everyday backpack helps carry personal essentials on the move."}],
    variants:{label:"Color preview",values:["Graphite","Clay","Moss"]},
    specs:[{label:"Listing highlights",value:"Portable audio · Bluetooth speaker",meaning:"The sample catalog describes a portable Bluetooth speaker.",why:"Check connection range, battery life, and water rating for your use."},{label:"Category",value:"Electronics",meaning:"An audio product for shared or portable listening.",why:"Think about where you plan to listen and how you will power it."}]
  },
  12: {
    brand:"NOVA Home Edit", bestFor:"New plant owners looking for a small indoor gardening starting point.", standout:"The sample listing groups the product as an indoor starter set.", beforeBuy:"Plant varieties, pot contents, light needs, and delivery conditions are not listed.",
    bestForList:["Exploring indoor gardening","A small home project for a bright corner"], considerList:["You need pet-safe or low-light plants","You need confirmed varieties or care instructions"],
    loved:["Beginner-friendly positioning","Home-focused project","Fresh gift idea"], concerns:["Plant varieties not named","Care and delivery details missing"],
    alternatives:[{id:2,label:"Style the corner",reason:"A table lamp for another kind of home update."},{id:8,label:"Comfort pick",reason:"A soft furnishing for a cozy living space."},{id:7,label:"Try a new habit",reason:"A reading pick for a different kind of at-home activity."}],
    accessories:[{id:2,reason:"A table lamp can help style the same corner; plant lighting needs depend on the variety."},{id:8,reason:"A soft throw can add a comfortable layer to a plant-filled space."}],
    specs:[{label:"Listing highlights",value:"Indoor gardening · starter set",meaning:"The sample catalog describes an indoor plant starter set.",why:"Confirm plant types, light requirements, and delivery conditions."},{label:"Category",value:"Home",meaning:"A home project and indoor-gardening listing.",why:"Choose plants that suit your room, climate, and care routine."}]
  }
};

export function getProductNotes(product) {
  return notes[product.id] || {
    brand:"NOVA Finds",
    bestFor:"Shoppers exploring " + product.category.toLowerCase() + " picks.",
    standout:product.features + " is the main highlight in this sample listing.",
    beforeBuy:"Check the full seller description and specifications before a real purchase.",
    bestForList:["Exploring " + product.category.toLowerCase() + " products","Comparing product details and price"],
    considerList:["You need technical details that are not listed here","You need confirmed seller or policy information"],
    loved:["Clear product category","Simple price comparison","Easy-to-scan sample listing"],
    concerns:["Full specifications not connected","Seller policies need confirmation"],
    alternatives:[], accessories:[],
    specs:[{label:"Listing highlights",value:product.features,meaning:"A short catalog summary for this demo product.",why:"Confirm full technical details before making a purchase."},{label:"Category",value:product.category,meaning:"The current NOVA sample-catalog category.",why:"Compare relevant details and intended use before choosing."}]
  };
}

