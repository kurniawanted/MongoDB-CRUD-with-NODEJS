const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const enrichSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
    },
    slug: String,
    noTelp: {
      type: Number,
    },
    alamat: {
      type: String,
    },
    kotaKabupaten: {
      type: String,
    },
    witel: {
      type: String,
    },
    regional: {
      type: String,
    },
    keyword: {
      type: String,
    },
    jenisUsaha: {
      type: String,
    },
    segment: {
      type: String,
    },
    review: {
      type: String,
    },
    rating: {
      type: String,
    },
    photo: {
      type: String,
    },
    url: {
      type: String,
    },
    koordinat: {
      type: String,
    },
    namaSekolah: {
      type: String,
    },
    npsn: {
      type: String,
    },
    jenjang: {
      type: String,
    },
    statusSekolah: {
      type: String,
    },
    alamatSekolah: {
      type: String,
    },
    tanggalPendirian: {
      type: String,
    },
    statusKepemilikan: {
      type: String,
    },
    luasTanahMilik: {
      type: String,
    },
    photo: {
      type: String,
    },
    namaWajibPajak: {
      type: String,
    },
    npwp: {
      type: String,
    },
    telpAlternatif: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    sertifikatIso: {
      type: String,
    },
    dayaListrik: {
      type: String,
    },
    aksesInternet: {
      type: String,
    },
    aksesInternetAlternatif: {
      type: String,
    },
    kepalaSekolah: {
      type: String,
    },
    operator: {
      type: String,
    },
    akreditasi: {
      type: String,
    },
    jumlahPesertaDidik: {
      type: String,
    },
    flagEnriching: {
      type: Array,
    },
    creditedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretEnrich: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

enrichSchema.virtual('durationsWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware: runs before .save() and .create()
enrichSchema.pre('save', function (next) {
  this.slug = slugify(this.nama, { lower: true });
  next();
});

// enrichSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// })

// Query Middleware
enrichSchema.pre(/^find/, function (next) {
  this.find({ secretEnrich: { $ne: true } });

  this.start = Date.now();
  next();
});

enrichSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
enrichSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretEnrich: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Enrich = mongoose.model('Enrich', enrichSchema);

module.exports = Enrich;
