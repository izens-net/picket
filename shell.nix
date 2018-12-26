{ pkgs ? import <nixpkgs> {}
}:

with pkgs;

stdenv.mkDerivation {
    name = "netizens-dev";
    buildInputs = [ nodejs-8_x ] ;
    LANG = "en_US.UTF-8";
    libraryPkgconfigDepends = [ zlib ];
    shellHook = ''
      export PATH="`pwd`/node_modules/.bin:$PATH"
      export IS_NIX_SHELL="true"
      export LOCALE_ARCHIVE="${pkgs.glibcLocales}/lib/locale/locale-archive";
    '';
}
