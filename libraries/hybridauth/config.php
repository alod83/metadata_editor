<?php

/**
 * HybridAuth
 * http://hybridauth.sourceforge.net | http://github.com/hybridauth/hybridauth
 * (c) 2009-2015, HybridAuth authors | http://hybridauth.sourceforge.net/licenses.html
 */
// ----------------------------------------------------------------------------------------
//	HybridAuth Config file: http://hybridauth.sourceforge.net/userguide/Configuration.html
// ----------------------------------------------------------------------------------------

return
		array(
			"base_url" => "http://localhost/LPW/MetadataEditor/libraries/hybridauth/",
			"providers" => array(
				// openid providers
				"OpenID" => array(
					"enabled" => false
				),
				"Yahoo" => array(
					"enabled" => false,
					"keys" => array("key" => "", "secret" => ""),
				),
				"AOL" => array(
					"enabled" => false
				),
				"Google" => array(
					"enabled" => true,
					"keys" => array("id" => "538189115544-jr4qdhcmlsiddi5oskraillp9do2u50f.apps.googleusercontent.com", "secret" => "J3t_VU3Q2PSyxWy4_3jNynws"),
					"scope" => "https://www.googleapis.com/auth/userinfo.profile ".
                               "https://www.googleapis.com/auth/userinfo.email"
				),
				"Facebook" => array(
					"enabled" => true,
					"keys" => array("id" => "735876226559625", "secret" => "38a1ae5051577521dcef38527a58e00c"),
					"scope"   => ['email', 'user_about_me', 'user_birthday', 'user_hometown'], // optional
					"trustForwarded" => true
				),
				"Twitter" => array(
					"enabled" => false,
					"keys" => array("key" => "yBnSS8oUGNBjUvKpjnkIrXFoM", "secret" => "8D4K6iXOjwKOKxKpuluZFE4f8t48qInzvssKk4bTQfNoHlaLl9"),
					"includeEmail" => false
				),
				// windows live
				"Live" => array(
					"enabled" => false,
					"keys" => array("id" => "", "secret" => "")
				),
				"LinkedIn" => array(
					"enabled" => false,
					"keys" => array("key" => "", "secret" => "")
				),
				"Foursquare" => array(
					"enabled" => false,
					"keys" => array("id" => "", "secret" => "")
				),
			),
			// If you want to enable logging, set 'debug_mode' to true.
			// You can also set it to
			// - "error" To log only error messages. Useful in production
			// - "info" To log info and error messages (ignore debug messages)
			"debug_mode" => false,
			// Path to file writable by the web server. Required if 'debug_mode' is not false
			"debug_file" => "../log.txt",
);
